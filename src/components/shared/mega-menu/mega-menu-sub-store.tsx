import { MenuConfig, MenuItem } from "@/config/types";
import { MegaMenuFooter, MegaMenuSubDefault } from "./components";

const MegaMenuSubStore = ({ items }: { items: MenuConfig }) => {
  const storeItem = items[5];

  return (
    <div className="w-full gap-0 lg:w-[550px]">
      <div className="pt-4 pb-2 lg:p-7.5">
        {storeItem.children?.map((item: MenuItem, index) => {
          return (
            <div key={`profile-${index}`} className="flex flex-col">
              <h3 className="text-foreground mb-2 ps-2.5 text-sm leading-none font-semibold lg:mb-4">
                {item.title}
              </h3>
              <div className="grid lg:grid-cols-2 lg:gap-5">
                {item.children?.map((item: MenuItem, index) => {
                  return (
                    <div key={`profile-sub-${index}`} className="space-y-0.5">
                      {item.children && MegaMenuSubDefault(item.children)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <MegaMenuFooter />
    </div>
  );
};

export { MegaMenuSubStore };
