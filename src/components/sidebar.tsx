import Link from "next/link";

export default function Sidebar() {
  return (
    <aside>
      <ul>
        <li>
          <Link href={"/myday"}>My Day</Link>
        </li>

        <li>
          <Link href={"/important"}>Important</Link>
        </li>

        <li>
          <Link href={"/tasks"}>Tasks</Link>
        </li>
      </ul>
    </aside>
  );
}
