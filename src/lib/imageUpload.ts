const uploadToCloudinary = async (file: File, folderName: String): Promise<string> => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "BizzWeb",
    );
    formDataUpload.append("folder", `ecommerce_uploads/${folderName}`);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formDataUpload,
        },
    );

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Image upload failed");
    }

    const data = await res.json();
    return data.secure_url;
};