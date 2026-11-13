import type { ResumeInput } from '../types'

export const SAMPLE_RESUME: ResumeInput = {
  jobDescription: `Senior Frontend Engineer

We are looking for a senior frontend engineer to lead the development of our customer-facing payments platform. You will own complex React and TypeScript features, evolve our design system, and raise the bar for accessibility across the product.

Required:
- 6+ years building production web applications
- Deep experience with React and TypeScript
- Strong testing practice with Vitest, React Testing Library, and Playwright
- Accessibility expertise, including WCAG 2.1 AA
- Experience building and maintaining design systems with Storybook
- GraphQL API integration experience
- Technical leadership, code review, and mentoring

Preferred:
- Next.js and server-side rendering
- Performance profiling and Core Web Vitals optimization
- Internationalization and localization
- Experience in fintech or payments

You will collaborate closely with product, design, and backend teams, and help shape frontend architecture.`,
  skills: `React, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, Vitest, React Testing Library, Playwright, WCAG 2.1, accessibility auditing, design systems, Storybook, GraphQL, Apollo Client, Node.js, Git, GitHub Actions`,
  experience: `Senior Frontend Engineer, Northwind Payments (2021 - present)
Led a team of five engineers building the merchant dashboard in React and TypeScript. Introduced a shared design system in Storybook that cut new feature build time by 30 percent. Drove an accessibility program that brought the dashboard to WCAG 2.1 AA. Integrated GraphQL with Apollo Client and reduced average page load time by 40 percent. Mentored two junior engineers and ran weekly code reviews.

Frontend Engineer, Lumen Commerce (2018 - 2021)
Built checkout and account flows in React and TypeScript. Added Vitest and React Testing Library coverage across the checkout suite. Worked with designers to standardize spacing and typography tokens.`,
  education: `BSc Computer Science, University of Lagos, 2018
Certificate in Web Accessibility, 2022`,
  projects: `Accessibility Audit Toolkit (open source)
A command-line tool that scans React applications for common WCAG issues and suggests fixes. Built with TypeScript and Node.js.

GraphQL Analytics Dashboard
A side project that visualizes payment metrics with React, Apollo Client, and a small Node.js GraphQL server.`,
}
