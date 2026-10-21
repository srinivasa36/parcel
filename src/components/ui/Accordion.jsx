import Icon from "./Icon";

export default function Accordion({ items }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.id} open={item.defaultOpen} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[17px] font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
            {item.title}
            <Icon
              name="chevronDown"
              className="h-5 w-5 text-ink-mute transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="pb-6 text-ink-soft">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
