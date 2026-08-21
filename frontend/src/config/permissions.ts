// src/config/permissions.ts — role-based permission matrix
// Define which roles can access which features/actions.

export const ROLES = [
  'master_admin',
  'company_admin',
  'government',
  'state_manager',
  'city_manager',
  'center_admin',
  'technical',
  'paper_setter',
  'entry_operator',
  'biometric_operator',
  'observer',
  'candidate',
] as const

export type Role = (typeof ROLES)[number]

export type Permission =
  | 'view_dashboard'
  | 'manage_users'
  | 'manage_exams'
  | 'manage_papers'
  | 'manage_candidates'
  | 'view_reports'
  | 'manage_payments'
  | 'manage_settings'

export const permissions: Record<Role, Permission[]> = {
  master_admin:       ['view_dashboard', 'manage_users', 'manage_exams', 'manage_papers', 'manage_candidates', 'view_reports', 'manage_payments', 'manage_settings'],
  company_admin:      ['view_dashboard', 'manage_users', 'manage_exams', 'manage_papers', 'manage_candidates', 'view_reports', 'manage_payments'],
  government:         ['view_dashboard', 'manage_exams', 'view_reports'],
  state_manager:      ['view_dashboard', 'manage_candidates', 'view_reports'],
  city_manager:       ['view_dashboard', 'manage_candidates', 'view_reports'],
  center_admin:       ['view_dashboard', 'manage_candidates'],
  technical:          ['view_dashboard', 'manage_papers'],
  paper_setter:       ['view_dashboard', 'manage_papers'],
  entry_operator:     ['view_dashboard', 'manage_candidates'],
  biometric_operator: ['view_dashboard'],
  observer:           ['view_dashboard', 'view_reports'],
  candidate:          ['view_dashboard'],
}
