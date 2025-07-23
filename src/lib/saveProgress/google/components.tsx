import { useCallback, useEffect, useState } from "preact/hooks";
import { useGoogle } from "./context";
import { useNavigate } from "react-router";

const API_KEY = import.meta.env.VITE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/drive.appdata";

const GapiScript = (props: { onLoad: () => void }) => {
    const { onLoad } = props;
    return (
        <script
            async
            src="https://apis.google.com/js/api.js"
            onLoad={onLoad}
        ></script>
    );
};

const GisScript = (props: { onLoad: () => void }) => {
    const { onLoad } = props;
    return (
        <script
            async
            src="https://accounts.google.com/gsi/client"
            onLoad={onLoad}
        ></script>
    );
};

export const GoogleScripts = () => {
    const { googleState, setGoogleState } = useGoogle();

    const [gapiBranchCompleted, setGapiBranchCompleted] = useState(false);
    const [gisBranchCompleted, setGisBranchCompleted] = useState(false);
    const [tokenClient, setTokenClient] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!gapiBranchCompleted || !gisBranchCompleted) return;

        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw resp;
            }
            setGoogleState("ready");
            navigate("/learn");
        };

        if (gapi.client.getToken() === null) {
            tokenClient.requestAccessToken({ prompt: "consent" });
        } else {
            tokenClient.requestAccessToken({ prompt: "" });
        }
    }, [
        gapiBranchCompleted,
        gisBranchCompleted,
        setGoogleState,
        tokenClient,
        navigate,
    ]);

    const onGapiScriptLoad = useCallback(() => {
        gapi.load("client", async () => {
            await gapi.client.init({
                apiKey: API_KEY,
            });
            setGapiBranchCompleted(true);
        });
    }, [setGapiBranchCompleted]);

    const onGisScriptLoad = useCallback(() => {
        const tokenClientNew = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: "", // defined later
        });
        setTokenClient(tokenClientNew);
        setGisBranchCompleted(true);
    }, [setTokenClient]);

    if (googleState === "initial") return null;

    return (
        <>
            <GapiScript onLoad={onGapiScriptLoad} />
            <GisScript onLoad={onGisScriptLoad} />
        </>
    );
};
