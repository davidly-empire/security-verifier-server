"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { cn } from "@/lib/utils";

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <Menu as="div" className="relative inline-block text-left">{children}</Menu>;
}

export function DropdownMenuTrigger({ children }: any) {
  return (
    <Menu.Button as="div" className="cursor-pointer">
      {children}
    </Menu.Button>
  );
}

export function DropdownMenuContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items
        className={cn(
          "absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
          className
        )}
      >
        {children}
      </Menu.Items>
    </Transition>
  );
}

export function DropdownMenuItem({
  children,
  className,
  ...props
}: any) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          {...props}
          className={cn(
            "w-full px-4 py-2 text-left text-sm",
            active ? "bg-gray-100" : "",
            className
          )}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
}

export const DropdownMenuSeparator = () => (
  <div className="my-1 h-px bg-gray-200" />
);
