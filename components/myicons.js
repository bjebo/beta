import AddSVG from '../assets/icons/add.svg';
import ClubSVG from '../assets/icons/club.svg';
import HomeSVG from '../assets/icons/home.svg';
import YouSVG from '../assets/icons/you.svg';
import LeaderBoardSVG from '../assets/icons/leaderboard.svg';

export function AddIcon({ size = 50, color }) {
  return <AddSVG width={size} height={size} {...(color ? { fill: color } : {})} />;
}
export function ClubIcon({ size = 50, color }) {
  return <ClubSVG width={size} height={size} {...(color ? { fill: color } : {})} />;
}
export function HomeIcon({ size = 50, color }) {
  return <HomeSVG width={size} height={size} {...(color ? { fill: color } : {})} />;
}
export function YouIcon({ size = 50, color }) {
  return <YouSVG width={size} height={size} {...(color ? { fill: color } : {})} />;
}
export function LeaderBoardIcon({ size = 50, color }) {
  return <LeaderBoardSVG width={size} height={size} {...(color ? { fill: color } : {})} />;
}