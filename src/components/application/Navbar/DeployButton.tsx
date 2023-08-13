import { Loader2 } from "lucide-react";
import { type FC } from "react";
import { Button } from "~/components/ui/Button";

type DeployButtonProps = {
    isLoading: boolean;
    onClick: () => void;
};

export const DeployButton: FC<DeployButtonProps> = ({ isLoading, onClick }) => {
    return (
        <>
            {isLoading ? (
                <Button className="w-full" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </Button>
            ) : (
                <Button className="w-full" onClick={onClick}>
                    Deploy
                </Button>
            )}
        </>
    );
};
