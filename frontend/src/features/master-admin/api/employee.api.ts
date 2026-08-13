import api from '@/services/api'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types'
import type { Employee, EmployeeStatistics } from '../types/employee.types'

const BASE_PATH = '/employees'

export interface EmployeeSearchParams extends PaginationParams {
  status?: string
  companyId?: string
  department?: string
  role?: string
  startDate?: string
  endDate?: string
}

export interface CreateEmployeePayload {
  companyId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  designation: string
  role: string
  joiningDate: string
  dob?: string
  gender?: string
  salary?: number
  address?: string
  city?: string
  state?: string
  country?: string
  pincode?: string
}

export type UpdateEmployeePayload = Partial<CreateEmployeePayload>

export const employeeApi = {
  getEmployees: async (params?: EmployeeSearchParams): Promise<PaginatedResponse<Employee>> => {
    const { data } = await api.get<any>(BASE_PATH, { params })

    // Transform backend { data: { data: [], total... } } to frontend PaginatedResponse
    if (data.data && data.data.data) {
      return {
        success: data.success,
        data: data.data.data,
        pagination: {
          page: data.data.page,
          limit: data.data.limit,
          total: data.data.total,
          totalPages: data.data.totalPages,
          hasNextPage: data.data.page < data.data.totalPages,
          hasPrevPage: data.data.page > 1,
        },
      }
    }
    return data as PaginatedResponse<Employee>
  },

  getEmployeeById: async (id: string): Promise<ApiResponse<Employee>> => {
    const { data } = await api.get<ApiResponse<Employee>>(`${BASE_PATH}/${id}`)
    return data
  },

  createEmployee: async (payload: CreateEmployeePayload): Promise<ApiResponse<Employee>> => {
    const { data } = await api.post<ApiResponse<Employee>>(BASE_PATH, payload)
    return data
  },

  updateEmployee: async (
    id: string,
    payload: UpdateEmployeePayload,
  ): Promise<ApiResponse<Employee>> => {
    const { data } = await api.patch<ApiResponse<Employee>>(`${BASE_PATH}/${id}`, payload)
    return data
  },

  deleteEmployee: async (id: string): Promise<ApiResponse<Employee>> => {
    const { data } = await api.delete<ApiResponse<Employee>>(`${BASE_PATH}/${id}`)
    return data
  },

  restoreEmployee: async (id: string): Promise<ApiResponse<Employee>> => {
    const { data } = await api.patch<ApiResponse<Employee>>(`${BASE_PATH}/${id}/restore`)
    return data
  },

  updateEmployeeStatus: async (id: string, status: string): Promise<ApiResponse<Employee>> => {
    const { data } = await api.patch<ApiResponse<Employee>>(`${BASE_PATH}/${id}/status`, { status })
    return data
  },

  assignEmployeeRole: async (id: string, role: string): Promise<ApiResponse<Employee>> => {
    const { data } = await api.patch<ApiResponse<Employee>>(`${BASE_PATH}/${id}/assign-role`, {
      role,
    })
    return data
  },

  resetEmployeePassword: async (
    id: string,
    newPassword: string,
  ): Promise<ApiResponse<Employee>> => {
    const { data } = await api.patch<ApiResponse<Employee>>(`${BASE_PATH}/${id}/reset-password`, {
      newPassword,
    })
    return data
  },

  getEmployeeStatistics: async (): Promise<ApiResponse<EmployeeStatistics>> => {
    const { data } = await api.get<ApiResponse<EmployeeStatistics>>(`${BASE_PATH}/statistics`)
    return data
  },

  getEmployeeLoginHistory: async (
    id: string,
    params?: PaginationParams & any,
  ): Promise<PaginatedResponse<any>> => {
    const { data } = await api.get<PaginatedResponse<any>>(`${BASE_PATH}/${id}/login-history`, {
      params,
    })
    return data
  },

  getEmployeeActivity: async (
    id: string,
    params?: PaginationParams & any,
  ): Promise<PaginatedResponse<any>> => {
    const { data } = await api.get<PaginatedResponse<any>>(`${BASE_PATH}/${id}/activity`, {
      params,
    })
    return data
  },
}
