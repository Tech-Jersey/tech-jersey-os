/**
 * roles.ts — Centralized role-based access control helpers for Payload CMS.
 *
 * Role hierarchy:
 *   admin  → Full access (create, read, update, delete everything)
 *   editor → Content management (create/update blog posts, case studies, testimonials, services)
 *   viewer → Read-only (authenticated read of private collections like Leads)
 *
 * Usage: import { isAdmin, isAdminOrEditor, isLoggedIn, isPublic } from '../access/roles'
 */
import type { Access } from 'payload'

/** Only users with role === 'admin' are granted access. */
export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

/** Admins and editors are granted access. */
export const isAdminOrEditor: Access = ({ req }) =>
  req.user?.role === 'admin' || req.user?.role === 'editor'

/** Any authenticated user (any role) is granted access. */
export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

/** Publicly accessible — no authentication required. */
export const isPublic: Access = () => true
