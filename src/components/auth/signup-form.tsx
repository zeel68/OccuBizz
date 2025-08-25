"use client";

import { CardWrapper } from "./card-wrapper";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SignupSchema } from "@/models/schemas";
import { FormError } from "../form/form-error";
import { FormSuccess } from "../form/from-success";

import { useTransition } from "react";

export const SignupForm = () => {
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof SignupSchema>>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            email: "",
            name: "",
            confirmPassword: "",
            password: "",
        },
    });

    const onSubmit = (data: z.infer<typeof SignupSchema>) => {
        startTransition(() => {
            console.log(data);
            // Example: call your signup API
            // signup(data).then(() => {
            //   setSuccess("User created successfully");
            // }).catch(console.error);
        });
    };

    return (
        <CardWrapper
            headerLable="Inventory Signup"
            backbuttonLabel="Have an account? Log in"
            backbutton
            backbuttonHref="/auth/login"
            showSocialLogin
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            placeholder="Your Name"
                                            {...field}
                                            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            placeholder="you@example.com"
                                            {...field}
                                            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            type="password"
                                            placeholder="••••••••"
                                            {...field}
                                            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            type="password"
                                            placeholder="••••••••"
                                            {...field}
                                            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormError
                        error={
                            form.formState.errors.name?.message ||
                            form.formState.errors.email?.message ||
                            form.formState.errors.password?.message ||
                            form.formState.errors.confirmPassword?.message ||
                            form.formState.errors.root?.message
                        }
                    />
                    <FormSuccess msg="" />

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-primary text-white text-md font-semibold rounded-xl py-3 hover:bg-primary/90 transition"
                    >
                        {isPending ? "Creating..." : "Create Account"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
