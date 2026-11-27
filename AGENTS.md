# ICWS Website Development Instructions

These instructions are the central source of truth for all agents working on the Interactive College Wayfinding System website. Follow the project requirements below when inspecting, planning, implementing, integrating, reviewing, and testing the site. The specification does not prescribe an implementation stack; inspect repository documentation and files before choosing technologies, and do not invent a stack.

## Mission and product understanding

Build a complete, professional, responsive website presenting the Interactive College Wayfinding System (ICWS), its application, features, AI assistant ABC-chan, navigation process, and technical architecture. This is a real implementation task: do not stop after planning, a homepage, or a prototype.

ICWS is an indoor wayfinding application for college students, staff, and visitors. Its purpose is to help users:

- Find classrooms, offices, and facilities.
- Navigate inside college buildings.
- Identify their current indoor location.
- Receive turn-by-turn directions.
- Navigate between floors.
- Choose between stairs and lifts.
- Find barrier-free routes.
- Access room information.
- Use NFC-compatible electronic doors where authorised.

### ABC-chan identity

ABC-chan is the AI assistant that makes the routes. The ABC logo represents ABC-chan and is a core part of the application's identity.

- Present ABC-chan as the intelligent navigation assistant that helps users find destinations and guides them through the college.
- Use the supplied ABC logo consistently, especially on the homepage and application introduction.
- Give ABC-chan a dedicated section and make the branding recognisable throughout the website.
- Do not describe ABC-chan as merely a decorative mascot or replace it with a generic chatbot.
- Do not claim advanced AI functionality is implemented when it is only part of the proposed system. Clearly distinguish implemented functionality from proposed functionality.

## Multi-agent organisation and ownership

Use specialised agents where useful. Before delegating, the lead agent must inspect the repository and assets, create an implementation plan, define shared design conventions and interfaces, and assign clear file ownership. Agents must not overwrite one another's work. The lead agent integrates and reviews all work and runs the final tests.

Recommended workstreams:

1. **Lead software architect and development coordinator:** Inspect repository, documentation, assets, framework, dependencies, and reusable components; create the plan; define shared conventions; assign tasks and file ownership; coordinate integration; review all completed work; run final tests.
2. **UI/UX and design system:** Establish ICWS visual identity; create reusable design components; define colours, typography, spacing, and buttons; implement responsive navigation; create consistent cards, sections, and page layouts; integrate ABC-chan branding. The design must feel like a real software product.
3. **Homepage and product presentation:** Build the homepage, hero, product introduction, main features overview, ABC-chan introduction, application navigation, calls to action, and navigation to other pages or sections. Create a strong first impression.
4. **Application showcase:** Integrate all 13 supplied iPhone-framed screenshots; group them by navigation stage; create a professional responsive gallery; add image enlargement/lightbox, previous/next controls, and short explanations. Never replace supplied screenshots with generated alternatives.
5. **Features and user journey:** Explain room search, facilities and services, indoor maps, Wi-Fi positioning, manual location adjustment, turn-by-turn navigation, floor changes, lift/stair selection, barrier-free routing, NFC access, room information, and user profile/settings. Create dedicated explanatory sections.
6. **Architecture and technical documentation:** Explain system architecture, technology overview, backend and database, indoor positioning, routing logic, NFC integration, project scope, and limitations. Create a professional architecture diagram. Clearly distinguish proposed from implemented functionality.
7. **Quality assurance:** Test all pages; responsive layouts; navigation and links; image paths; interactive elements; production builds; report and fix integration problems.

The lead remains accountable for the whole integrated website regardless of delegation.

## Product presentation and shared design system

Follow REDESIGN.md and the five compositions in `design/concepts/`. Present the indoor journey to W201 in a predominantly white studio setting. Place one complete navigation phone at native resolution in the daylight architectural scene. A smaller search phone may establish depth. Use the supplied ABC mark and local Inter; reserve midnight navy for selected technical content.

Give each page a distinct structure. Use a lightweight translucent header, a dominant product image on Home, an editorial feature exhibition, a chapter-led sticky walkthrough, labelled branching architecture flows and a concise project profile. On narrow screens, change the composition and keep access to every screen and chapter.

A route traverses two illustrated levels. Anchor every route vertex and the moving marker to the same floor geometry. Drive floor focus from scroll progression, support direct controls, and show the complete route with reduced motion or scripting disabled. Avoid ambient looping motion.

Keep the existing static Bootstrap five-page implementation. Serve Bootstrap CSS, Inter, the ABC logo, application screens and illustrations locally. Use native HTML, CSS and JavaScript for interactions that the browser can provide. Review the current design in a browser before changing its composition.

- Draw on Apple’s product presentation through complete, deliberately positioned devices and concise visual walkthroughs. Draw on Linear’s compact navigation, measured type and precise alignment. Create original ICWS diagrams and compositions.
- Use the indoor map as the visual language. Cobalt marks routes and selections, a blue dot marks a starting point, and a red pin identifies the destination. Keep physical floor plans and logical architecture diagrams legible at narrow widths.
- Maintain shared tokens and shell styles in `css/icws.css`. Use Inter with system fallbacks, deep navy `#132c40`, route blue `#245dc4`, pale map surfaces `#edf3f6` and fine rules `#d6e1e6`. Align the header, content and footer to the same responsive container, capped at 1180px.
- Set headings in a responsive, balanced scale. Prioritise clear line breaks and useful reading widths. Give each section a purpose and vary its composition according to its content. Use rounded surfaces around related visuals and controls.
- Keep the original ABC logo compact alongside the ICWS wordmark and in the assistant introduction. ICWS is the application and ABC-chan is its proposed AI navigation assistant.
- Preserve each supplied PNG, its transparency and its intrinsic ratio. Include intrinsic image dimensions, use contain sizing, and keep the complete frame inside its presentation at every breakpoint. Check tilted compositions for contact between phone borders. Use native-resolution screens in normal views and reserve enlargement for the viewer.
- Use purposeful, finite motion. The route trace, screen changes, hover and focus treatments should clarify an action or state. Keep text and controls available immediately. Respect reduced motion and provide a readable static illustration if scripting is unavailable.
- Support desktop, tablet and phone layouts explicitly. Keep navigation and dialogs keyboard accessible, maintain visible focus, label controls and preserve touch targets. Expose current navigation and selected screens programmatically. A modal must contain focus, support Escape and arrow keys, and restore focus when dismissed.

## Required five-page website architecture

Build exactly five primary website pages. Do not restore the previous ten-page structure or place all information on the homepage:

- `index.html` — Home, including ABC-chan branding and introduction.
- `features.html` — Product features and accessibility information, with ABC-chan in the feature context.
- `app-showcase.html` — All 13 screenshots plus the complete interactive navigation journey.
- `technology.html` — System architecture, technology/integration explanation, scope, and limitations.
- `about.html` — About Us: project background, objectives, stakeholders, proposed benefits, three team placeholders, and contact/feedback form.

Merge ABC-chan into Home and Features; merge accessibility into Features; merge How It Works into App Showcase; merge project information, team members, and contact into About Us. Avoid duplicate standalone pages for these topics.

Keep Home concise and visually attractive, with short previews linking to the other primary pages. Reduce text significantly across the site. Prioritise screenshots, visual explanations, illustrations, icons, and strong layouts over long paragraphs. Avoid repetitive card layouts, excessive text, unnecessary whitespace, and generic AI-generated design patterns. The site should feel like a modern software product website, not an academic report.

Use a consistent responsive navigation bar, footer, ABC-chan branding, and design system across all five pages. Use relative `.html` links and mark the current page accessibly. Keep all page-to-page links working. Place one short, clear prototype disclaimer on the homepage. It must explain that the screens show a prototype and that indoor positioning, route calculation, backend services, and NFC depend on campus deployment. Do not repeat this disclaimer on every page or imply that integrations are already running.

Implement the page-specific requirements below on the named page, retaining their required content and functionality in a compact, visual presentation.

### A. Homepage (`index.html`)

Create a concise polished landing page containing the ICWS logo, shared main navigation, hero section, short indoor-wayfinding introduction, ABC-chan introduction, short application preview, brief main-feature and user-journey previews, accessibility introduction, and calls to action linking to the dedicated pages. The complete screenshots, feature explanations, journey, architecture, team, and contact content belong on their dedicated pages.

Suggested headline: **“Find Your Way Around Campus.”**

Suggested supporting text: **“Meet ABC-chan, your intelligent indoor navigation assistant. Find rooms, explore facilities and navigate college buildings with confidence.”**

### B. About Us (`about.html`)

Explain the problem of navigating college buildings, why indoor wayfinding is needed, intended users, proposed solution, and project objectives.

### C. Meet ABC-chan (Home and `features.html`)

Give ABC-chan a dedicated section. Explain that ABC-chan is the AI navigation assistant, helps users find destinations, assists with route selection, and supports navigation throughout the building. Use the supplied ABC logo prominently. Make clear which capabilities are proposed rather than implemented.

### D. Application Showcase (`app-showcase.html`)

Show all 13 supplied iPhone-framed application screenshots in this exact order:

1. Entrance Screen
2. Home Screen
3. Search Results
4. Room Details
5. Detecting Current Location
6. Manual Location Adjustment
7. Choose Lift or Stairs
8. Navigate to Lift or Stairs
9. Arrive at Lift or Stairs
10. Changing Floor
11. Confirming Floor Change
12. Navigate to Destination
13. Arrive at Destination

Expected asset directory: `public/images/screenshots/`.

Expected filenames, corresponding to the ordered screens above:

1. `01-entrance-screen.png`
2. `02-home-screen.png`
3. `03-search-results.png`
4. `04-room-details.png`
5. `05-detect-current-location.png`
6. `06-manual-location-adjustment.png`
7. `07-choose-lift-or-stairs.png`
8. `08-navigate-to-lift-or-stairs.png`
9. `09-arrive-at-lift-or-stairs.png`
10. `10-changing-floor.png`
11. `11-confirm-floor-change.png`
12. `12-navigate-to-destination.png`
13. `13-arrive-at-destination.png`

Screenshot requirements:

- Preserve original image proportions.
- Display the complete iPhone frames; do not crop the phones.
- Use a responsive gallery and group screens into logical navigation stages.
- Add a short explanation for every screen.
- Allow each screenshot to open in a larger lightbox.
- Provide previous and next image controls.
- Use actual supplied assets, including the latest versions and updated ABC logo on screen 01.
- If expected files are absent, inspect available assets before creating any placeholder.
- Do not replace supplied screenshots with generated alternatives.

### E. Features (`features.html`)

Explain all major application functionality, using suitable illustrations and real application screenshots where appropriate:

1. Room search.
2. Facility and service search.
3. Automatic building and floor identification.
4. Wi-Fi indoor positioning.
5. Manual location correction.
6. Indoor floor maps.
7. Turn-by-turn navigation.
8. Lift and staircase selection.
9. Floor changing.
10. Barrier-free routing.
11. NFC door access.
12. Room information.
13. User profile and settings.

### F. How It Works (`app-showcase.html`)

Create a visual, interactive explanation of the user journey. Explain the steps in this order:

1. Open ICWS.
2. Search for a destination.
3. Identify its building and floor automatically.
4. Detect the user's current location.
5. Ask the user to confirm their location.
6. Allow manual correction if necessary.
7. Determine whether the destination is on the same floor.
8. If it is on another floor, let the user choose stairs or lift.
9. Calculate the route.
10. Navigate to the selected stairs or lift.
11. Change floors.
12. Detect and confirm the new floor.
13. Continue navigation to the destination.
14. Display arrival information.

Present ABC-chan as the assistant guiding the user through the process. Include both same-floor and multi-floor navigation.

### G. Accessibility (`features.html`)

Explain barrier-free routes, wheelchair-friendly navigation, lifts and ramps, avoiding stairs, and accessible facilities.

### H. System architecture (`technology.html`)

Create a professional architecture diagram containing and explaining the responsibilities and relationships of:

- Mobile application.
- ABC-chan navigation assistant.
- Backend API.
- Database.
- Wi-Fi access points.
- Indoor positioning.
- Indoor maps.
- Route calculation.
- NFC readers.
- Electronic door access system.

### I. Technology (`technology.html`)

Explain proposed technologies and integrations. Do not invent a technology stack. Inspect existing project documentation and repository information before describing or selecting technologies.

Project information, including background, problem statement, objectives, scope, stakeholders, limitations, and proposed benefits, must be on `about.html`. Do not omit any of these topics.

### J. Project information

Include project background, problem statement, objectives, scope, stakeholders, limitations, and proposed benefits.

### K. Team (`about.html`)

Create a professional team section for three project members. Use placeholders for missing names, photographs, and responsibilities. Do not invent personal details.

### L. Contact and feedback (`about.html`)

Implement a frontend contact form containing name, email, subject, and message. Include validation and success and error states. Backend integration is not required unless one already exists. Do not present a frontend-only demonstration as if it sends messages to a backend.

## Interactivity and accessibility

The website must work, not merely look attractive. Implement:

- Responsive navigation.
- Working internal links.
- Screenshot gallery and lightbox.
- Previous and next screenshot controls.
- Interactive feature sections.
- Expandable FAQs.
- Interactive architecture diagram where practical.
- Interactive user journey.
- Contact form validation.
- Smooth scrolling.
- Accessible keyboard interactions.

Do not create fake backend functionality. Use frontend demonstrations or clearly labelled mock data where necessary.

## Content quality and terminology

Write concise, professional content for college management, teachers, students, staff, and visitors. Use consistent terminology.

Keep this distinction consistent throughout the website:

- A **facility** is a physical place or resource, such as a library, toilet, or cafeteria.
- A **service** is something provided by the college, such as student support, reception, or an IT helpdesk.

## Implementation rules

### Before development

- Inspect the repository.
- Inspect supplied assets.
- Identify the existing framework and dependencies without assuming a stack.
- Identify existing reusable components.
- Define a shared design system and interfaces.
- Assign clear agent responsibilities and file ownership before parallel work.

### During development

- Work directly in the repository.
- Reuse existing code where appropriate.
- Avoid unnecessary dependencies.
- Maintain reusable components.
- Keep code organised.
- Ensure responsive behaviour.
- Do not create duplicate pages or components.
- Coordinate changes so agents do not overwrite one another's work.
- Make sensible implementation decisions and continue through implementation; do not stop at planning or request approval after each stage.

## Final testing and review

Before declaring completion, the lead agent must integrate and review the whole site and:

- Run the application.
- Run the production build when a build command exists. For the current static distribution, serve the repository over HTTP and test the shipped HTML, CSS, JavaScript and assets directly.
- Fix compilation errors.
- Test every page.
- Confirm the site contains the five primary pages and merged topics do not survive as duplicate standalone pages.
- Test the shared navigation and footer from every page, including every required page-to-page link.
- Test all links.
- Test the screenshot gallery.
- Check all 13 images.
- Check mobile and desktop layouts.
- Check image proportions and confirm no screenshot phone is cropped.
- Check console errors.
- Check accessibility basics, including keyboard interaction.
- Remove temporary code.
- Report and fix integration problems.

### Browser visual review

Capture all five current pages before substantial redesigns. Save baseline images in `qa/screenshots/before/` and final images in `qa/screenshots/after/`. Capture both a full-page image and the initial viewport. Inspect important interactions in their active state, including the enlarged screenshot and mobile navigation.

Test each page at 1920×1080, 1440×900, 1280×800, 1024×768, 768×1024, 390×844 and 375×812. Inspect the images as well as checking overflow, missing assets, console errors and intrinsic proportions. Check every showcase screen, both floor scenarios, the architecture disclosures, the contact form, reduced motion and keyboard focus. During a redesign, perform at least two visual refinement passes and verify the corrections in the browser. Inspect intermediate scroll and floor-transition states alongside static captures. Keep studio redesign evidence in `qa/screenshots/{before,after}/cinematic/studio/` and interaction frames in `qa/screenshots/motion/`.

## Definition of done

The project is complete only when:

- The entire website has been implemented.
- All main pages and sections exist.
- ABC-chan is properly integrated into the product identity.
- All 13 application screenshots are displayed.
- The navigation workflow is explained correctly.
- The architecture is presented clearly.
- All interactive features work.
- The website is responsive.
- The production build succeeds when configured, and the shipped site passes browser checks over HTTP.
