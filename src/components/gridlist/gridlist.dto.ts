import { ApiDataRes } from "@api/base/base-service.dto";
import { PagingDataDto } from "@api/base/BaseService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ReactElement } from "react";



export interface GridListProps<DataDto, FilterQueryDto> {
    apiService: (query: FilterQueryDto, config?: AxiosRequestConfig) => Promise<AxiosResponse<ApiDataRes<PagingDataDto<DataDto>>, unknown>>
    gridClassName?: string
    renderCard: (data: DataDto, triggerRefreshList: () => void) => ReactElement
    defaultQuery?: FilterQueryDto
    renderForm?: (setQuery: React.Dispatch<React.SetStateAction<FilterQueryDto>>) => ReactElement
}



