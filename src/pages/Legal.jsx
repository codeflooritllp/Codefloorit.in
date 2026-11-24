import { useSeo, breadcrumbLd, crumbs } from "../lib/seo";
import { CONTACT } from "../data/site";
import { PageHero } from "../components/ui";
import { Toc, slugify } from "../components/editorial";

const CONTENT = {
  privacy: {
    title: "Privacy Policy",
    path: "/privacy-policy",
    desc: "How Codefloor IT handles information submitted through this website.",
    updated: "November 2026",
    blocks: [
      ["Overview", "This policy explains what information Codefloor IT collects through this website and how it is used. It applies only to codefloorit.in."],
      ["Information we collect", "We collect the information you choose to send us through the contact form, by email or by phone — typically your name, company, email address, phone number, an optional budget range and a description of your project. Like most websites, the servers that deliver this site may record standard technical request data such as IP address and browser type. We also use Google Analytics to understand how the site is used, as described under Analytics below."],
      ["How we use it", "We use the information you submit solely to respond to your enquiry, discuss your project and provide the services you request. We do not sell your information or share it with third parties for marketing."],
      ["Contact form", `When you submit the contact form, your details (your name, email address, phone number, company and budget range if you give them, the service you chose and your message) are sent to this website's server, which checks them and emails them through our email provider to ${CONTACT.email}. Your email address is set as the reply-to address, so our answer goes straight to you. The server does not save your enquiry in a database; it is kept in our email account. To limit spam and repeated submissions, the server briefly holds your IP address, and a one-way fingerprint of your email address and message, in temporary memory.`],
      ["Analytics", "This website uses Google Tag Manager to load Google Analytics, services provided by Google. They help us see which pages are visited, how visitors find the site, and which buttons and contact links are used. Google Analytics uses cookies and records information such as the pages you view, your device and browser type and your approximate location. Our site does not send your name, email address, phone number or message to Google Analytics: for a contact-form submission it records only that a form was sent and which service was chosen. Google handles this data under its own privacy policy (policies.google.com/privacy). You can block analytics cookies in your browser settings, or with Google's opt-out add-on (tools.google.com/dlpage/gaoptout)."],
      ["WhatsApp", "If you contact us on WhatsApp, through the WhatsApp links on this site or the option offered when the contact form cannot send your message, WhatsApp opens with your message filled in and nothing is sent until you press send there. Messages sent this way, or to our WhatsApp number directly, are carried by WhatsApp, a service run by Meta Platforms, and are subject to WhatsApp's own privacy policy (whatsapp.com/legal/privacy-policy). Please do not send anything through WhatsApp that you would prefer to share by email."],
      ["Data retention", "Enquiry information is kept for as long as needed to respond and, where a project proceeds, for the duration of our working relationship and a reasonable period afterwards for record-keeping."],
      ["Your choices", `You can ask what information we hold about you, ask us to correct it, or ask us to delete it, by emailing ${CONTACT.email}.`],
      ["Changes", "We may update this policy from time to time. The latest version will always be available on this page."],
    ],
  },
  terms: {
    title: "Terms & Conditions",
    path: "/terms",
    desc: "The terms that apply to your use of the Codefloor IT website.",
    updated: "October 2026",
    blocks: [
      ["Use of this website", "This website is provided for general information about Codefloor IT and its services. You may view and share its content for personal, non-commercial reference."],
      ["No warranty", "The content on this website is provided in good faith and for general information. Project examples describe work at the time of writing; features and status may change. Nothing on this site is a binding offer or a guarantee of a specific outcome, price or timeline."],
      ["Project work", "Any engagement to design or develop software is governed by a separate written agreement between you and Codefloor IT. That agreement, not this website, defines scope, deliverables, cost and ownership."],
      ["Intellectual property", "The design, text and graphics on this website are owned by Codefloor IT unless stated otherwise. Product and technology names mentioned belong to their respective owners."],
      ["Contact", `Questions about these terms can be sent to ${CONTACT.email}.`],
    ],
  },
};

export default function Legal({ kind }) {
  const c = CONTENT[kind];
  const trail = crumbs({ name: c.title, path: c.path });
  useSeo({ title: c.title, description: c.desc, path: c.path, jsonLd: breadcrumbLd(trail) });

  return (
    <>
      <PageHero crumbs={trail} title={c.title} sub={c.desc} />
      <section className="section">
        <div className="container article">
          <aside className="article__aside">
            <Toc items={c.blocks.map(([h]) => ({ id: slugify(h), text: h }))} label="Sections" />
          </aside>
          <div className="article__main prose legal">
            {c.blocks.map(([h, p], i) => (
              <section key={h} aria-labelledby={slugify(h)}>
                <h2 id={slugify(h)}><span className="legal__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{h}</h2>
                <p>{p}</p>
              </section>
            ))}
            <p className="prose__meta">Last updated: {c.updated}.</p>
          </div>
        </div>
      </section>
    </>
  );
}
