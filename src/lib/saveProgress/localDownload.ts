export function generate_and_download() {
    const data = [];
    data.push("This is a test\n");
    data.push("Of creating a file\n");
    data.push("In a browser\n");
    const file = new File(data, "file.txt", {
        type: "application/octet-stream",
    });
    var url = URL.createObjectURL(file);
    window.open(url);
    URL.revokeObjectURL(url);
}
