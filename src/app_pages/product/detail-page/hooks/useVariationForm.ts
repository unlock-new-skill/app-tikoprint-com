import { GetShopProductVariationDto, shopProductService } from '@api/shopProductService'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
export interface SaveAttributeAndVariationFormDto {
    attributes: {
        id?: string
        name: string
        value: { v: string }[]
    }[]
    variations: {
        id?: string
        v_id?: string
        sku?: string
        price: number
        stock: number

        attributes: { [key: string]: string }
    }[]
}

const schema = yup.object().shape({
    attributes: yup.array().of(yup.object().shape({
        name: yup.string().required("Required").max(20),
        value: yup.array().of(yup.object().shape({
            v: yup.string().required("Required"),
        })).required("Required")
    })).required("Required"),
    variations: yup.array().of(yup.object().shape({
        sku: yup.string(),
        price: yup.number().required("Required"),
        stock: yup.number().required("Required"),

        attributes: yup.object()
    })).required()


})

export function useVariationForm({ initData }: { initData: GetShopProductVariationDto | null }) {
    const { id } = useParams()

    const methodForm = useForm<SaveAttributeAndVariationFormDto>({
        mode: 'onTouched',
        resolver: yupResolver(schema),
        defaultValues: initData ? {
            attributes: initData?.attributes.map(i => ({
                id: i.id,
                name: i.name,
                value: i.values.map(i => ({ v: i }))
            })),
            variations: initData?.variations.map(v => ({
                attributes: v.attributes,
                id: uuid(),
                v_id: v.id,
                price: v.price,
                sku: v?.sku,
                stock: v?.stock
            }))
        } : {
            attributes: [],
            variations: []
        }
    })

    const onSubmit = methodForm.handleSubmit(async data => {
        try {

            const remapPayload = {
                attributes: data.attributes.map(i => ({ ...i, value: i.value.map(i => i.v) })),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                variations: data.variations.map(i => ({
                    id: i.v_id,
                    attributes: i.attributes,
                    sku: i.sku,
                    stock: i.stock,
                    price: i.price,
                })),
                shopProductId: id as string
            }
            await shopProductService.saveVariation(remapPayload, id as string)
            toast.success("Saved")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            if (typeof e === 'object' && e !== null && 'message' in e) {
                const error = e as { message: string }
                toast.error(error.message || 'An unexpected error occurred')
            } else {
                toast.error('An unexpected error occurred')
            }
        }
    })

    return { methodForm, onSubmit }
}
