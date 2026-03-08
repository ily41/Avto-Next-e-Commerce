"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export type FieldConfig = {
    name: string;
    label: string;
    type: "text" | "number" | "date" | "textarea" | "switch" | "file" | "file-multiple" | "select" | "combobox" | "custom";
    placeholder?: string;
    options?: { label: string; value: string }[];
    renderCustom?: (field: any, form: any) => React.ReactNode;
}

const FIELD_ORDER: Record<FieldConfig["type"], number> = {
    text: 0, number: 0, date: 0, select: 0, combobox: 0, textarea: 0,
    switch: 1,
    file: 2, "file-multiple": 2, custom: 2,
}
export const sortFields = (fields: FieldConfig[]) =>
    [...fields].sort((a, b) => FIELD_ORDER[a.type] - FIELD_ORDER[b.type])

interface DynamicAddPopupProps {
    title: string;
    triggerText: string;
    schema: z.ZodSchema<any>;
    defaultValues: any;
    fields: FieldConfig[];
    onSubmit: (values: any) => Promise<void>;
    isLoading?: boolean;
}

export function DynamicAddPopup({
    title,
    triggerText,
    schema,
    defaultValues,
    fields,
    onSubmit,
    isLoading
}: DynamicAddPopupProps) {
    const [open, setOpen] = useState(false)
    const [imagePreviews, setImagePreviews] = useState<Record<string, string | string[]>>({})

    const form = useForm({
        resolver: zodResolver(schema as any),
        defaultValues,
    })

    useEffect(() => {
        return () => {
            Object.values(imagePreviews).forEach(val => {
                if (Array.isArray(val)) {
                    val.forEach(v => URL.revokeObjectURL(v))
                } else if (typeof val === 'string') {
                    URL.revokeObjectURL(val)
                }
            })
        }
    }, [imagePreviews])

    async function handleSubmit(values: any) {
        try {
            await onSubmit(values)
            form.reset()
            setImagePreviews({})
            setOpen(false)
        } catch (err: any) {
            const msg = err?.data ?? err?.message ?? "Something went wrong";
            toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
            console.error("Popup submit error", err)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) {
                form.reset()
                setImagePreviews({})
            }
        }}>
            <DialogTrigger asChild>
                <Button>{triggerText}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sortFields(fields).map((fieldConfig) => (
                                <FormField
                                    key={fieldConfig.name}
                                    control={form.control}
                                    name={fieldConfig.name}
                                    render={({ field }) => {
                                        if (fieldConfig.type === "custom" && fieldConfig.renderCustom) {
                                            return <div className="col-span-full">{fieldConfig.renderCustom(field, form)}</div>
                                        }

                                        let content = null;

                                        switch (fieldConfig.type) {
                                            case "text":
                                                content = <Input placeholder={fieldConfig.placeholder} {...field} value={field.value || ""} />
                                                break;
                                            case "date":
                                                content = <Input type="date" {...field} value={field.value || ""} />
                                                break;
                                            case "number":
                                                content = <Input type="number" placeholder={fieldConfig.placeholder} {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} value={field.value || 0} />
                                                break;
                                            case "textarea":
                                                content = <Textarea placeholder={fieldConfig.placeholder} {...field} value={field.value || ""} />
                                                break;
                                            case "switch":
                                                content = <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                                                break;
                                            case "select":
                                                content = (
                                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={fieldConfig.placeholder || "Select an option"} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {fieldConfig.options?.map(opt => (
                                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )
                                                break;
                                            case "combobox":
                                                const selectedOpt = fieldConfig.options?.find(o => o.value === field.value);
                                                content = (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant="outline" role="combobox" className={cn("w-full justify-between font-normal", !field.value && "text-muted-foreground")}>
                                                                    {field.value ? selectedOpt?.label : (fieldConfig.placeholder || "Select option")}
                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                                            <Command>
                                                                <CommandInput placeholder="Search..." />
                                                                <CommandList>
                                                                    <CommandEmpty>No results found.</CommandEmpty>
                                                                    <CommandGroup>
                                                                        {fieldConfig.options?.map((opt) => (
                                                                            <CommandItem key={opt.value} value={opt.label} onSelect={() => field.onChange(opt.value)}>
                                                                                <Check className={cn("mr-2 h-4 w-4", opt.value === field.value ? "opacity-100" : "opacity-0")} />
                                                                                {opt.label}
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                )
                                                break;
                                            case "file":
                                                const singlePreview = imagePreviews[fieldConfig.name] as string | undefined;
                                                content = (
                                                    <div className="flex flex-col gap-2">
                                                        {singlePreview && (
                                                            <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                                                                <img src={singlePreview} alt="Preview" className="object-cover w-full h-full" />
                                                                <button type="button" onClick={() => { field.onChange(null); setImagePreviews(p => ({ ...p, [fieldConfig.name]: "" })) }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X size={12} /></button>
                                                            </div>
                                                        )}
                                                        <FormControl>
                                                            <Input type="file" accept="image/*" onChange={(e) => {
                                                                const file = e.target.files?.[0]
                                                                if (file) {
                                                                    field.onChange(file)
                                                                    setImagePreviews(p => ({ ...p, [fieldConfig.name]: URL.createObjectURL(file) }))
                                                                }
                                                            }} />
                                                        </FormControl>
                                                    </div>
                                                )
                                                break;
                                            case "file-multiple":
                                                const multiPreview = (imagePreviews[fieldConfig.name] as string[]) || [];
                                                content = (
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                            {multiPreview.map((src, i) => (
                                                                <div key={i} className="relative w-24 h-24 border rounded-md overflow-hidden">
                                                                    <img src={src} alt={`Preview ${i}`} className="object-cover w-full h-full" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <FormControl>
                                                            <Input type="file" accept="image/*" multiple onChange={(e) => {
                                                                const files = Array.from(e.target.files || [])
                                                                if (files.length > 0) {
                                                                    field.onChange(files)
                                                                    setImagePreviews(p => ({ ...p, [fieldConfig.name]: files.map(f => URL.createObjectURL(f)) }))
                                                                }
                                                            }} />
                                                        </FormControl>
                                                    </div>
                                                )
                                                break;
                                        }

                                        return (
                                            <FormItem className={cn(
                                                fieldConfig.type === "textarea" ? "col-span-full" : "",
                                                fieldConfig.type === "file" || fieldConfig.type === "file-multiple" ? "col-span-full" : "",
                                                fieldConfig.type === "switch" ? "flex flex-row items-center gap-2 space-y-0" : "flex flex-col"
                                            )}>
                                                <FormLabel>{fieldConfig.label}</FormLabel>
                                                {fieldConfig.type !== "switch" && fieldConfig.type !== "combobox" ? <FormControl>{content}</FormControl> : content}
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Submit"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
