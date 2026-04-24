## FIGMAMCP.md - Getting Started for frontend website build

# Frontend Website Rules 
- This rule should be followed every session, before writing any frondend code.

---

## Always Do First

- **Invoke the `frontend-design` skill** before writing any frontend code, every session, except the backend admin page no need to follow this document.

This is a non-negotiable step. It ensures that every design claude generates modern UI standards instead of producing generic or basic layouts and following strict to figma design if provided.

This skill helps with :
- Applying proper spacing and typography
- adding subtle animations and visual hierarchy
- IMPORTANT: 
-- Avoid "AI-generated looking" designs
-- Avoid Creating polished layouts, if the Reference Design or Reference Figma design is exist

## IF using Reference Design (Screenshot)
- Prioritize screenshot image fidelity to match designs exactly
- Avoid hardcoded values
- Follow WCAG requirements for accessibility
- Add component documentation
- Place UI components in `public/assets`; avoid inline styles unless truly necessary
- Place Image in `media`; avoid inline styles unless truly necessary

## IF using figma design mcp
- Prioritize Figma fidelity to match designs exactly
- Avoid hardcoded values, use design tokens from Figma where available
- Follow WCAG requirements for accessibility
- Add component documentation
- Place UI components in `public/assets`; avoid inline styles unless truly necessary
- Place Image in `media`; avoid inline styles unless truly necessary
- IMPORTANT: please follow `FIGMAMCP.md`

## IF the code have layout builder plugins
-- To create new page create new folder name of page and create newfile `page.tsx` on `src/app/(frontend)` and call every section from `src/components/Blocks`
-- To create every section, create component and store on `src/components/Blocks`
-- for every section implementation, examine the components from `src/components/Blocks`, if the components have similarity layout to the design, Always use components from `src/components/Blocks` when possible, if not exist create new component
-- store the content on `src/components/language/`, by create new file with json format with different name for every different section.
-- make sure all component can be reuseable, avoid hardcode the content into component