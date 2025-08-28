import AddEditProductPage from '@/components/dashboard/Product/add-edit-product';
import React from 'react'

interface EditProductPageProps {
    params: Promise<{
        id: string
    }>
}
export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;
    return (
        <div>
            <AddEditProductPage id={id} />
        </div>
    )
}
