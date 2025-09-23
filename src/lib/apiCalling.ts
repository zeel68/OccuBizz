import { useUserStore } from "@/store/userStore"
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"

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
    private baseURL = "https://backend.dhaneri.com/api"
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
                'Content-Type': 'application/json',
            },
            ...config,
        })

        // Request interceptor to include auth token and session ID
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // Get session ID from localStorage
                const sessionId = localStorage.getItem("sessionId")

                // Add session ID to headers if it exists
                if (sessionId) {
                    config.headers["x-session-id"] = sessionId
                }

                // Only add auth token if user is logged in
                const userState = useUserStore.getState();
                if (userState.isUserLoggedIn && userState.authToken) {
                    config.headers.Authorization = `Bearer ${userState.authToken}`
                    console.log("Adding auth token to request:", config.url, userState.authToken.substring(0, 20) + "...")
                } else {
                    console.log("No auth token available for request:", config.url)
                }

                return config
            },
            (error) => {
                console.error("Request interceptor error:", error)
                return Promise.reject(error)
            }
        )

        // Response interceptor to handle token refresh
        this.axiosInstance.interceptors.response.use(
            (response) => {
                console.log("API response success:", response.config.url, response.status)
                return response
            },
            async (error) => {
                const originalRequest = error.config
                console.log("API error:", error.config?.url, error.response?.status)

                // If error is not 401 or we've already tried refreshing, reject
                if (error.response?.status !== 401 || originalRequest._retry) {
                    return Promise.reject(error)
                }

                // Mark this request as already retried
                originalRequest._retry = true

                // If we're already refreshing, add to queue
                if (this.isRefreshing) {
                    console.log("Already refreshing token, adding request to queue")
                    return new Promise((resolve, reject) => {
                        this.failedRequests.push({ resolve, reject, config: originalRequest })
                    })
                }

                this.isRefreshing = true
                const refreshToken = useUserStore.getState().refreshToken

                console.log("Attempting token refresh with refresh token:", refreshToken ? "exists" : "missing")

                // If no refresh token exists, reject the request
                if (!refreshToken) {
                    console.log("No refresh token available, cannot refresh")
                    this.isRefreshing = false
                    useUserStore.getState().clearUser()
                    return Promise.reject(error)
                }

                try {
                    // Attempt to refresh token - use a separate axios instance to avoid interceptors
                    const refreshAxios = axios.create()
                    const response = await refreshAxios.post(
                        `${this.baseURL}/auth/refresh-token`,
                        { refreshToken },
                        {
                            headers: {
                                "x-session-id": localStorage.getItem("sessionId") || ""
                            }
                        }
                    )

                    console.log("Token refresh response:", response.data)

                    if (response.data.success) {
                        const { accessToken, refreshToken: newRefreshToken } = response.data.data

                        // Update store with new tokens
                        useUserStore.getState().updateTokens(accessToken, newRefreshToken)
                        console.log("Tokens updated in store")

                        // Update Authorization header for future requests
                        this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`
                        console.log("Authorization header updated")

                        // Update the original request header
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`

                        // Retry all queued requests
                        console.log("Retrying", this.failedRequests.length, "queued requests")
                        this.failedRequests.forEach((request) => {
                            (request.config.headers as any).Authorization = `Bearer ${accessToken}`
                            this.axiosInstance.request(request.config)
                                .then(request.resolve)
                                .catch(request.reject)
                        })

                        this.failedRequests = []

                        console.log("Token refresh successful, retrying original request")
                        // Retry the original request
                        return this.axiosInstance(originalRequest)
                    } else {
                        throw new Error("Token refresh failed: " + JSON.stringify(response.data))
                    }
                } catch (refreshError) {
                    console.error("Token refresh error:", refreshError)

                    // If refresh fails, clear tokens and redirect to login
                    useUserStore.getState().clearUser()

                    // Reject all queued requests
                    this.failedRequests.forEach((request) => {
                        request.reject(refreshError)
                    })
                    this.failedRequests = []

                    // Redirect to login page
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login'
                    }

                    return Promise.reject(refreshError)
                } finally {
                    this.isRefreshing = false
                }
            }
        )
    }

    private async handleRequest<T>(request: Promise<AxiosResponse<T>>): Promise<ApiResponse<T>> {
        try {
            const response = await request
            return {
                success: true,
                data: response.data,
                status: response.status
            }
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                return {
                    success: false,
                    error: error.response.data || { message: error.message },
                    status: error.response.status
                }
            } else {
                return {
                    success: false,
                    error: { message: error.message || 'An unexpected error occurred' }
                }
            }
        }
    }

    public async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.handleRequest(this.axiosInstance.get<T>(endpoint, config))
    }

    public async post<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.handleRequest(this.axiosInstance.post<T>(endpoint, data, config))
    }

    public async put<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.handleRequest(this.axiosInstance.put<T>(endpoint, data, config))
    }

    public async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.handleRequest(this.axiosInstance.delete<T>(endpoint, config))
    }

    public async patch<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
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
                ...config
            })
        )
    }
}

// Create and export a singleton instance
const apiClient = new ApiClient()

export default apiClient