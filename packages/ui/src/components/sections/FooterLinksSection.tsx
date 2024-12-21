export interface FooterLink {
  linkUrl: string;
  linkTitle: string;
  linkId: string;
}

export interface FooterLinkSectionProps {
  links: FooterLink[];
  title?: string;
}

export const FooterLinksSection = ({ links, title }: FooterLinkSectionProps) => {
  return (
    <div>
      <h3 className="mb-6 font-bold">{title}</h3>
      <ul className="space-y-4 text-sm text-muted-foreground">
        {links.map(({ linkUrl, linkId, linkTitle }) => (
          <li
            key={linkId}
            className="font-medium hover:text-primary"
          >
            <a href={linkUrl}>{linkTitle}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
