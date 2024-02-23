// main tools
import { useState } from "react";
import dynamic from "next/dynamic";

// nextUi
import {
  Navbar,
  Link,
  NavbarItem,
  NavbarMenu,
  NavbarContent,
  NavbarMenuItem,
  NavbarMenuToggle,
  NavbarBrand,
  Image,
} from "@nextui-org/react";

// icons
import { List } from "react-bootstrap-icons";

// utils
import { items } from "./utils";

// styles
// import { helvetica } from '@/styles/fonts';
import classes from "./styles.module.css";

// types
import { FC } from "react";

export const NavbarApp: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const WalletMultiButton = dynamic(
    () =>
      import("@solana/wallet-adapter-react-ui").then(
        (mod) => mod.WalletMultiButton
      ),
    { ssr: false }
  );
  return (
    <div>
      <Navbar
        maxWidth="2xl"
        isMenuOpen={isMenuOpen}
        className={classes.navbar}
        onMenuOpenChange={() => setIsMenuOpen(!isMenuOpen)}
        classNames={{
          brand: classes.navbar_brand,
          toggle: classes.navbar_toggle,
          menu: classes.navbar_menuMobile,
          content: classes.navbar_content,
        }}
      >
        <NavbarBrand className="mt-10">
          <div>
            <Link href="/" className={classes.logo}>
              <Image src="/assets/icons/logo.png" alt="Logo" width={250} />
            </Link>
          </div>
        </NavbarBrand>

        <NavbarContent justify="end" className="sm:hidden">
          <NavbarMenuToggle
            icon={<List color="grey" size={50} />}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        <NavbarContent justify="end" className="hidden sm:flex">
          <div className="flex gap-3">
            {items.map((item, index) => (
              <NavbarItem key={index}>
                <Link
                  href={item.isActive ? item.path : "#"}
                  className={
                    item.isActive ? classes.items : classes.items_disabled
                  }
                >
                  {item.label}
                </Link>
              </NavbarItem>
            ))}
          </div>
          <div className={classes.walletButton}>
            <WalletMultiButton />
          </div>
        </NavbarContent>

        <NavbarMenu>
          <NavbarMenuItem>
            <div className={classes.walletButton}>
              <WalletMultiButton />
            </div>
          </NavbarMenuItem>
          {items.map((item, index) => (
            <NavbarMenuItem key={index}>
              <Link
                href={item.isActive ? item.path : "#"}
                className={
                  item.isActive ? classes.items : classes.items_disabled
                }
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </div>
  );
};
