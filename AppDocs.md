# AppDocs: Building Apps with shadcn/ui and Next.js

---

## 1. What is shadcn/ui?
- **Not a traditional component library**: Instead, it provides open, customizable component code you own and modify.
- **Philosophy**:
  - *Open Code*: You get the source code for every component.
  - *Composition*: Components share a predictable, composable interface.
  - *Distribution*: Uses a CLI and flat-file schema for easy sharing and updates.
  - *Beautiful Defaults*: Components look great out-of-the-box, but are easy to theme.
  - *AI-Ready*: Designed for easy AI code generation and improvement.
- **Built on**: Radix UI primitives (for accessibility), styled with Tailwind CSS.

---

## 2. What is Next.js?
- **React framework** for building full-stack web applications.
- **Features**:
  - File-based routing (App Router and Pages Router)
  - Server-side rendering (SSR), static site generation (SSG), and client-side rendering (CSR)
  - API routes, middleware, and edge functions
  - Built-in support for CSS, CSS Modules, Tailwind CSS, and more
  - Optimized image and font handling
  - Easy deployment (Vercel, etc.)

---

## 3. Setting Up shadcn/ui in a Next.js App

### Prerequisites
- Node.js, npm/yarn/pnpm
- Next.js app (use `npx create-next-app`)
- Tailwind CSS installed and configured

### Installation Steps
1. **Initialize shadcn/ui**
   ```sh
   npx shadcn@latest init
   ```
   - Prompts for style, base color, CSS variables, and directory aliases.
   - Creates a `components.json` config file.
2. **Install core dependencies**
   - `tailwindcss-animate`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`
   - Radix UI, React Hook Form, and others are installed as needed per component.
3. **Add components**
   ```sh
   npx shadcn@latest add button input form table ...
   ```
   - Generates component files in your chosen directory.

---

## 4. Using shadcn/ui Components
- **Import and use** like any React component:
  ```js
  import { Button } from '@/components/ui/button';
  <Button variant="outline">Click Me</Button>
  ```
- **Variants and utilities**:
  - Use helpers like `buttonVariants` for custom styling.
  - All components are styled with Tailwind and support dark mode.
- **Customizing**:
  - Edit the generated component files directly.
  - Use Tailwind classes and Radix UI props for accessibility and behavior.

---

## 5. Theming and Customization
- **Theme config** in `tailwind.config.js` and `components.json`.
- **CSS Variables**: Optionally use for colors, border radius, etc.
- **Add new variants**:
  - Extend Tailwind config and define new CSS variables in your global CSS.
- **Dark mode**: Supported out-of-the-box.
- **Global styles**: Place in `globals.css` or your chosen global stylesheet.

---

## 6. Forms, Tables, and Advanced Components
- **Forms**:
  - Use `npx shadcn@latest add form` to generate form components.
  - Integrates with React Hook Form and supports Zod validation.
- **Tables**:
  - Use `npx shadcn@latest add table` for table components.
  - Integrate with TanStack React Table for advanced features.
- **Other components**: Dialogs, modals, toasts, carousels, etc. are available and customizable.

---

## 7. Next.js Best Practices for shadcn/ui
- **Use the App Router** for new projects (in `/app` directory).
- **Organize components** in a dedicated folder (e.g., `/components/ui`).
- **Leverage server and client components** as needed.
- **Optimize images and fonts** using Next.js built-ins.
- **Use environment variables** for config and secrets.
- **Testing**: Use Jest, React Testing Library, or Vitest for unit and integration tests.
- **Deploy**: Vercel is recommended for seamless Next.js deployment.

---

## 8. Resources
- [shadcn/ui Docs](https://ui.shadcn.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Table](https://tanstack.com/table/v8)
- [React Hook Form](https://react-hook-form.com/)

---

## 9. Quick Reference: CLI Commands
- **Initialize shadcn**: `npx shadcn@latest init`
- **Add a component**: `npx shadcn@latest add <component>`
- **Create Next.js app**: `npx create-next-app@latest`
- **Run dev server**: `npm run dev` or `yarn dev`

---

## 10. Tips
- Always customize components to fit your design system.
- Use Tailwind utility classes for rapid styling.
- Keep your component codebase organized and modular.
- Regularly update dependencies and check for upstream changes.
- Write tests for all custom logic and components.

--- 