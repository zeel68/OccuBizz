import AddEditCategoryPage from '@/components/dashboard/Category/add-edit-category'
import React from 'react'

interface EditCategoryPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { id } = await params
    return <AddEditCategoryPage categoryId={id} />
}
