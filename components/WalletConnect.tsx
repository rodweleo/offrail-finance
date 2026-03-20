"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Wallet as WalletIcon, LogOut } from "lucide-react";
import { shortenAddress } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ReactNode, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Connector } from "wagmi";

interface WalletConnectProps {
  className?: string;
  disconnectedLabel?: string;
  onConnect?: () => void;
}

const RECOMMENDED_CONNECTORS = ["Coinbase Wallet", "coinbaseWallet"];
const LAST_CONNECTOR_KEY = "offrail_last_connector";

const getRecommendedConnectors = (
  connectors: readonly Connector[],
): { recommended: Connector[]; others: Connector[] } => {
  const recommended: Connector[] = [];
  const others: Connector[] = [];

  connectors.forEach((connector) => {
    if (
      RECOMMENDED_CONNECTORS.includes(connector.name) ||
      RECOMMENDED_CONNECTORS.includes(connector.id)
    ) {
      recommended.push(connector as Connector);
    } else {
      others.push(connector as Connector);
    }
  });

  return { recommended, others };
};

export const ConnectWallet = ({
  className,
  disconnectedLabel = "Connect Wallet",
  onConnect,
}: WalletConnectProps) => {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const [lastConnectorId, setLastConnectorId] = useState<string | null>(null);

  // Load last used connector from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LAST_CONNECTOR_KEY);
      setLastConnectorId(saved);
    }
  }, []);

  const handleConnect = (connector: Connector) => {
    // Save the connector ID for next time
    if (typeof window !== "undefined") {
      localStorage.setItem(LAST_CONNECTOR_KEY, connector.uid);
    }
    connect({ connector });
    setIsOpen(false);
    onConnect?.();
  };

  // Show connected state
  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className={className}>
            <WalletIcon className="w-4 h-4 mr-2" />
            {shortenAddress(address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => disconnect()}>
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Get recommended and other connectors
  const { recommended, others } = getRecommendedConnectors(connectors);
  const lastConnector = lastConnectorId
    ? connectors.find((c) => c.uid === lastConnectorId)
    : null;

  // If we have a last used connector, show quick connect button
  if (lastConnector && !isOpen) {
    return (
      <div className="flex flex-wrap gap-2 *:w-full">
        <Button
          onClick={() => handleConnect(lastConnector)}
          className={cn("cursor-pointer", className)}
          variant="default"
          size="lg"
        >
          {lastConnector.icon && (
            <Image
              src={lastConnector.icon}
              width={20}
              height={20}
              alt={lastConnector.name}
              className="mr-2"
            />
          )}
          <span>Continue with {lastConnector.name}</span>
        </Button>
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="lg"
          className="cursor-pointer"
        >
          More Wallets
        </Button>

        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Select a Wallet</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8 space-y-4">
              {/* Recommended Connectors */}
              {recommended.length > 0 && (
                <>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Recommended
                    </p>
                    {recommended.map((connector) => (
                      <Button
                        key={connector.uid}
                        onClick={() => handleConnect(connector)}
                        className={cn(
                          "w-full cursor-pointer justify-start",
                          className,
                        )}
                        variant="secondary"
                        size="lg"
                      >
                        {connector.icon && (
                          <Image
                            src={connector.icon}
                            width={20}
                            height={20}
                            alt={connector.name}
                            className="mr-3"
                          />
                        )}
                        <span className="flex-1 text-left">
                          {connector.name}
                        </span>
                      </Button>
                    ))}
                  </div>

                  {/* Separator */}
                  {others.length > 0 && (
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-background text-muted-foreground">
                          More options
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Other Connectors */}
              {others.length > 0 && (
                <div className="space-y-2">
                  {others.map((connector) => (
                    <Button
                      key={connector.uid}
                      onClick={() => handleConnect(connector)}
                      className={cn(
                        "w-full cursor-pointer justify-start",
                        className,
                      )}
                      variant="secondary"
                      size="lg"
                    >
                      {connector.icon && (
                        <Image
                          src={connector.icon}
                          width={20}
                          height={20}
                          alt={connector.name}
                          className="mr-3"
                        />
                      )}
                      <span className="flex-1 text-left">{connector.name}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  // Show drawer for initial connection
  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={cn("w-full cursor-pointer", className)}
        variant="default"
        size="lg"
      >
        {disconnectedLabel}
      </Button>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Connect Your Wallet</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 space-y-4">
            {/* Recommended Connectors */}
            {recommended.length > 0 && (
              <>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Recommended
                  </p>
                  {recommended.map((connector) => (
                    <Button
                      key={connector.uid}
                      onClick={() => handleConnect(connector)}
                      className={cn(
                        "w-full cursor-pointer justify-start",
                        className,
                      )}
                      variant="secondary"
                      size="lg"
                    >
                      {connector.icon && (
                        <Image
                          src={connector.icon}
                          width={20}
                          height={20}
                          alt={connector.name}
                          className="mr-3"
                        />
                      )}
                      <span className="flex-1 text-left">{connector.name}</span>
                    </Button>
                  ))}
                </div>

                {/* Separator */}
                {others.length > 0 && (
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-background text-muted-foreground">
                        More options
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Other Connectors */}
            {others.length > 0 && (
              <div className="space-y-2">
                {others.map((connector) => (
                  <Button
                    key={connector.uid}
                    onClick={() => handleConnect(connector)}
                    className={cn(
                      "w-full cursor-pointer justify-start",
                      className,
                    )}
                    variant="secondary"
                    size="lg"
                  >
                    {connector.icon && (
                      <Image
                        src={connector.icon}
                        width={20}
                        height={20}
                        alt={connector.name}
                        className="mr-3"
                      />
                    )}
                    <span className="flex-1 text-left">{connector.name}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const WalletDropdownDisconnect = () => {
  const { disconnect } = useDisconnect();

  return (
    <Button
      onClick={() => disconnect()}
      variant="destructive"
      className="w-full px-4 py-2 text-sm text-destructive rounded-md transition-colors flex items-center gap-2"
    >
      <LogOut className="w-4 h-4" />
      Disconnect
    </Button>
  );
};

export const Wallet = ({ children }: { children: ReactNode }) => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return null;
  }

  return <>{children}</>;
};
