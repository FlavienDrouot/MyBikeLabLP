import logoMarkSvg from '../../assets/logo-mark.svg?raw';

const themedSvg = logoMarkSvg.replace('#fbfaf6', 'currentColor');
const markInner = themedSvg.slice(
  themedSvg.indexOf('>') + 1,
  themedSvg.lastIndexOf('</svg>')
);

export default function LogoMark({ size = 28 }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: markInner }}
    />
  );
}
