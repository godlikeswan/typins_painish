import { WordStats } from "../../cards/cards";

export async function getGoogleFileId() {
    const listFilesRes = await gapi.client.request({
        path: "https://www.googleapis.com/drive/v3/files",
        method: "GET",
        params: {
            spaces: "appDataFolder",
        },
    });
    const files = listFilesRes.result.files;
    if (files.length === 0) return null;
    return files[0].id;
}

export async function createNewGoogleFile() {
    const createNewFileRes = await gapi.client.request({
        path: "https://www.googleapis.com/drive/v3/files",
        method: "POST",
        body: {
            name: "typins_painish-" + new Date().toISOString() + ".json",
            mimeType: "application/json",
            parents: ["appDataFolder"],
        },
    });
    return createNewFileRes.result.id;
}

export async function deleteGoogleFile(fileId: string) {
    const deleteFileRes = await gapi.client.request({
        path: `https://www.googleapis.com/drive/v3/files/${fileId}`,
        method: "DELETE",
    });
    return deleteFileRes;
}

export async function getGoogleFileData(fileId: string) {
    const fileDataRes = await gapi.client.request({
        path: `https://www.googleapis.com/drive/v3/files/${fileId}`,
        method: "GET",
        params: {
            alt: "media",
        },
    });
    return fileDataRes.result;
}

export async function loadGoogleFile(initFunc: () => WordStats[]) {
    const existingFileId = await getGoogleFileId();
    if (existingFileId) {
        const data = await getGoogleFileData(existingFileId);
        return { data, googleFileId: existingFileId };
    }
    const data = initFunc();
    const newFileId = await createNewGoogleFile();
    await updateGoogleFile(data, newFileId);
    return {
        data,
        googleFileId: newFileId,
    };
}

export async function updateGoogleFile(content: unknown, fileId: string) {
    const res = await gapi.client.request({
        path: `https://www.googleapis.com/upload/drive/v3/files/${fileId}`,
        method: "PATCH",
        params: {
            uploadType: "media",
        },
        headers: {
            "Content-Type": "application/json",
        },
        body: content,
    });

    return res;
}
