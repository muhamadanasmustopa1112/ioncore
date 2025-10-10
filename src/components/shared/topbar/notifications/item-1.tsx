import { useState } from "react";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ItemProps {
  userName: string;
  avatar: string;
  description: string;
  link: string;
  label: string;
  time: string;
  specialist: string;
  text: string;
}

export default function Item1({
  userName,
  avatar,
  description,
  link,
  label,
  time,
  specialist,
  text,
}: ItemProps) {
  const [emailInput, setEmailInput] = useState("");
  return (
    <div className="flex grow gap-2.5 px-5">
      <Avatar>
        <AvatarImage src={`/media/avatars/${avatar}`} alt="avatar" />
        <AvatarFallback>CH</AvatarFallback>
        <AvatarIndicator className="-end-1.5 -bottom-1.5">
          <AvatarStatus variant="online" className="size-2.5" />
        </AvatarIndicator>
      </Avatar>

      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium">
            <Link
              href="#"
              className="hover:text-primary text-mono font-semibold"
            >
              {userName}
            </Link>
            <span className="text-secondary-foreground"> {description} </span>
            <Link href="#" className="hover:text-primary text-primary">
              {link}
            </Link>
            <span className="text-secondary-foreground"> {label} </span>
          </div>

          <span className="text-muted-foreground flex items-center text-xs font-medium">
            {time}
            <span className="bg-mono/30 mx-1.5 size-1 rounded-full"></span>
            {specialist}
          </span>
        </div>

        <Card className="bg-muted/70 flex flex-col gap-2.5 rounded-lg p-3.5 shadow-none">
          <div className="text-secondary-foreground mb-px text-sm font-semibold">
            <Link
              href="#"
              className="hover:text-primary text-mono font-semibold"
            >
              @Cody{" "}
            </Link>
            <span className="text-secondary-foreground font-medium">
              {text}
            </span>
          </div>

          <div className="relative w-full sm:max-w-full">
            <ImageIcon className="text-muted-foreground absolute end-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Reply"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
