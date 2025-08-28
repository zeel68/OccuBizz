"use client";

import { AddProductsToCategoryPage } from '@/components/dashboard/Category/add-category-product';
import { useCategoryStore } from '@/store/StoreAdmin/categoryStore';
import React, { useEffect, useState } from 'react';

interface CategoryProductProps {
    params: {
        id: string;
    };
}

export default function CategoryProduct({ params }: CategoryProductProps) {
    const { id } = params;
    const { categories } = useCategoryStore();
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    useEffect(() => {
        const category = categories.find((category) => category._id === id);
        setSelectedCategory(category);
    }, [categories, id]);

    return (
        <div>
            {selectedCategory && (
                <AddProductsToCategoryPage category={selectedCategory} />
            )}
        </div>
    );
}
