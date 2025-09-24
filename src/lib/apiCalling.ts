import { useUserStore } from "@/store/userStore"
import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
} from "axios"

enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
}

interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: any
    status?: number
}

class ApiClient {
    private baseURL = "http://localhost:5050/api"
    private axiosInstance: AxiosInstance
    private isRefreshing = false
    private failedRequests: Array<{
        resolve: (value: any) => void
        reject: (reason?: any) => void
        config: AxiosRequestConfig
    }> = []

    constructor(config?: AxiosRequestConfig) {
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
            ...config,
        })

        /** Request interceptor to include auth token */
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const userState = useUserStore.getState()
                if (userState.isUserLoggedIn && userState.authToken) {
                    config.headers.Authorization = `Bearer ${userState.authToken}`
                    console.log(
                        "Adding auth token to request:",
                        config.url,
                        userState.authToken.substring(0, 20) + "...",
                    )
                } else {
                    console.log("No auth token available for request:", config.url)
                }
                return config
            },
            (error) => {
                console.error("Request interceptor error:", error)
                return Promise.reject(error)
            },
        )

        /** Response interceptor to handle token refresh */
        this.axiosInstance.interceptors.response.use(
            (response) => {
                console.log("API response success:", response.config.url, response.status)
                return response
            },
            async (error) => {
                const originalRequest = error.config
                console.log("API error:", error.config?.url, error.response?.status)

                if (error.response?.status !== 401 || originalRequest._retry) {
                    return Promise.reject(error)
                }

                originalRequest._retry = true

                if (this.isRefreshing) {
                    console.log("Already refreshing token, adding request to queue")
                    return new Promise((resolve, reject) => {
                        this.failedRequests.push({ resolve, reject, config: originalRequest })
                    })
                }

                this.isRefreshing = true
                const refreshToken = useUserStore.getState().refreshToken

                console.log("Attempting token refresh with refresh token:", refreshToken ? "exists" : "missing")

                if (!refreshToken) {
                    console.log("No refresh token available, cannot refresh")
                    this.isRefreshing = false
                    useUserStore.getState().clearUser()
                    return Promise.reject(error)
                }

                try {
                    const refreshAxios = axios.create()
                    const response = await refreshAxios.post(
                        `${this.baseURL}/auth/refresh-token`,
                        { refreshToken },
                    )

                    console.log("Token refresh response:", response.data)

                    if (response.data.success) {
                        const { accessToken, refreshToken: newRefreshToken } = response.data.data

                        useUserStore.getState().updateTokens(accessToken, newRefreshToken)
                        console.log("Tokens updated in store")

                        this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`

                        console.log("Retrying", this.failedRequests.length, "queued requests")
                        this.failedRequests.forEach((request) => {
                            (request.config.headers as any).Authorization = `Bearer ${accessToken}`
                            this.axiosInstance
                                .request(request.config)
                                .then(request.resolve)
                                .catch(request.reject)
                        })
                        this.failedRequests = []

                        console.log("Token refresh successful, retrying original request")
                        return this.axiosInstance(originalRequest)
                    } else {
                        throw new Error("Token refresh failed: " + JSON.stringify(response.data))
                    }
                } catch (refreshError) {
                    console.error("Token refresh error:", refreshError)

                    useUserStore.getState().clearUser()

                    this.failedRequests.forEach((request) => {
                        request.reject(refreshError)
                    })
                    this.failedRequests = []

                    if (typeof window !== "undefined") {
                        window.location.href = "/login"
                    }

                    return Promise.reject(refreshError)
                } finally {
                    this.isRefreshing = false
                }
            },
        )
    }

    private async handleRequest<T>(
        request: Promise<AxiosResponse<T>>,
    ): Promise<ApiResponse<T>> {
        try {
            const response = await request
            return {
                success: true,
                data: response.data,
                status: response.status,
            }
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                return {
                    success: false,
                    error: error.response.data || { message: error.message },
                    status: error.response.status,
                }
            } else {
                return {
                    success: false,
                    error: { message: error.message || "An unexpected error occurred" },
                }
            }
        }
    }

    public async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.handleRequest(this.axiosInstance.get<T>(endpoint, config))
    }

    public async post<T>(
        endpoint: string,
        data: any,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        return this.handleRequest(this.axiosInstance.post<T>(endpoint, data, config))
    }

    public async put<T>(
        endpoint: string,
        data: any,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        return this.handleRequest(this.axiosInstance.put<T>(endpoint, data, config))
    }

    public async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.handleRequest(this.axiosInstance.delete<T>(endpoint, config))
    }

    public async patch<T>(
        endpoint: string,
        data: any,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        return this.handleRequest(this.axiosInstance.patch<T>(endpoint, data, config))
    }

    public async request<T>(
        method: HttpMethod,
        endpoint: string,
        data?: any,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        return this.handleRequest(
            this.axiosInstance.request<T>({
                method,
                url: endpoint,
                data,
                ...config,
            }),
        )
    }
}

const apiClient = new ApiClient()
export default apiClient
