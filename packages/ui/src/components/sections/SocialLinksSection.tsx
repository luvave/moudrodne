import { FiInstagram, FiFacebook, FiTwitter, FiLinkedin, FiGithub, FiYoutube } from 'react-icons/fi';
import { ReactNode } from 'react';

export interface SocialLinksSectionProps {
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  youtubeUrl?: string;
}

export const SocialLinksSection = ({ instagramUrl, githubUrl, linkedinUrl, youtubeUrl, twitterUrl, facebookUrl }: SocialLinksSectionProps) => {
  const getSocialLink = (url: string | undefined, icon: ReactNode) => {
    if (typeof url !== 'undefined') {
      return (
        <li className="font-medium hover:text-primary">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            {icon}
          </a>
        </li>
      );
    }
    return null;
  };

  return (
    <ul className="flex items-center space-x-6 text-muted-foreground">
      {getSocialLink(instagramUrl, <FiInstagram className="size-6" />)}
      {getSocialLink(facebookUrl, <FiFacebook className="size-6" />)}
      {getSocialLink(twitterUrl, <FiTwitter className="size-6" />)}
      {getSocialLink(linkedinUrl, <FiLinkedin className="size-6" />)}
      {getSocialLink(githubUrl, <FiGithub className="size-6" />)}
      {getSocialLink(youtubeUrl, <FiYoutube className="size-6" />)}
    </ul>
  );
};
