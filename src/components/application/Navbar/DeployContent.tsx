import { type FC, type ReactNode, useState } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";

type DeployContentProps = {
    token: string;
    setToken: (token: string) => void;
    children: ReactNode;
};

export const DeployContent: FC<DeployContentProps> = ({
    token,
    setToken,
    children,
}) => {
    const [hasToken, setHasToken] = useState(false);

    return (
        <div className="grid gap-4">
            <div className="space-y-2">
                <h4 className="font-medium leading-none">Railway Token</h4>
                <p className="text-sm text-muted-foreground">
                    {hasToken
                        ? "Token saved in state"
                        : "Set your Railway token to deploy your repository."}
                </p>
            </div>
            {/*  */}
            <div className="grid gap-2">
                <div className="flex flex-col items-center gap-1">
                    <div className="flex w-full items-center gap-4">
                        {hasToken ? (
                            <>
                                <Button variant="secondary" onClick={() => setHasToken(false)}>
                                    Discard
                                </Button>
                                {children}
                            </>
                        ) : (
                            <>
                                <Input
                                    id="token"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="h-8 w-full flex-1"
                                />
                                <Button onClick={() => setHasToken(true)}>Save</Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
