"use client";

import { AddProductsToCategoryPage } from '@/components/dashboard/Category/add-category-product';
import { useCategoryStore } from '@/store/StoreAdmin/categoryStore';
import React, { use, useEffect, useState } from 'react';

interface CategoryProductProps {
    params: Promise<{
        id: string;
    }>;
}

export default function CategoryProduct({ params }: CategoryProductProps) {
    const { id } = use(params);
    const { categories, allCategories, fetchAllCategories } = useCategoryStore();
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    useEffect(() => {
        if (allCategories.length == 0) {
            fetchAllCategories();


        }
        const category = allCategories.find((category) => category._id === id);
        console.log(allCategories);

        setSelectedCategory(category);
    }, [fetchAllCategories, categories, allCategories]);

    return (
        <div>
            {selectedCategory && (
                <AddProductsToCategoryPage category={selectedCategory} />
            )}
        </div>
    );
}
