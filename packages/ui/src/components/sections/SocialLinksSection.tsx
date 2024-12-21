import { FiInstagram, FiFacebook, FiTwitter, FiLinkedin, FiGithub, FiYoutube } from 'react-icons/fi';

export interface SocialLinksSectionProps {
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  youtubeUrl?: string;
}

export const SocialLinksSection = ({ instagramUrl, githubUrl, linkedinUrl, youtubeUrl, twitterUrl, facebookUrl }: SocialLinksSectionProps) => {
  return (
    <ul className="flex items-center space-x-6 text-muted-foreground">
      {typeof instagramUrl !== 'undefined' && (
        <li className="font-medium hover:text-primary">
          <a href={instagramUrl}>
            <FiInstagram className="size-6" />
          </a>
        </li>
      )}
      {typeof facebookUrl !== 'undefined' && (
        <li className="font-medium hover:text-primary">
          <a href={facebookUrl}>
            <FiFacebook className="size-6" />
          </a>
        </li>
      )}
      {typeof twitterUrl !== 'undefined' && (
        <li className="font-medium hover:text-primary">
          <a href={twitterUrl}>
            <FiTwitter className="size-6" />
          </a>
        </li>
      )}
      {typeof linkedinUrl !== 'undefined' && (
        <li className="font-medium hover:text-primary">
          <a href={linkedinUrl}>
            <FiLinkedin className="size-6" />
          </a>
        </li>
      )}
      {typeof githubUrl !== 'undefined' && (
        <li className="font-medium hover:text-primary">
          <a href={githubUrl}>
            <FiGithub className="size-6" />
          </a>
        </li>
      )}
      {typeof youtubeUrl !== 'undefined' && (
        <li className="font-medium hover:text-primary">
          <a href={youtubeUrl}>
            <FiYoutube className="size-6" />
          </a>
        </li>
      )}
    </ul>
  );
};
