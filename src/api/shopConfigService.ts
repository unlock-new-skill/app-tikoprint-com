import BaseService from '@api/base/BaseService'
import { ApiDataRes } from './base/base-service.dto'

export interface BasicShopConfigDto {
    id?: string
    name: string
    logo_url: string
    seo_title: string
    seo_description: string
    seo_keywords: string
    config?: string
    deployed?: boolean
    site_domain?: string
    shopUITemplateId?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class ShopConfig extends BaseService<BasicShopConfigDto, any> {
    getBasicInfomation = () => {
        return this.request.get<ApiDataRes<BasicShopConfigDto | null>>('/api/seller/shop/config/my-shop')
    }

    saveBasicInfomation = (data: BasicShopConfigDto) => {
        return this.request.post<ApiDataRes<null>>('/api/seller/shop/config/basic', data)
    }

    // selectTemplate = (id: string) => {
    //     return this.request.patch(<ApiDataRes<true>)('/api/seller/shop')

    // } 
}

export const shopConfigService = new ShopConfig()
