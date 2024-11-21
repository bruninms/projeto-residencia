let pickerApiLoaded = false;
let oauthToken;

function loadPicker() {
    gapi.load('auth', { callback: onAuthApiLoad });
    gapi.load('picker', { callback: onPickerApiLoad });
}

function onAuthApiLoad() {
    gapi.auth.authorize(
        {
            'client_id': 'ID_DO_USUARIO',
            'scope': 'https://www.googleapis.com/auth/drive.file',
            'immediate': false
        },
        handleAuthResult
    );
}

function onPickerApiLoad() {
    pickerApiLoaded = true;
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
    }
}

function createPicker() {
    if (pickerApiLoaded && oauthToken) {
        const picker = new google.picker.PickerBuilder()
            .addView(google.picker.ViewId.DOCS)
            .setOAuthToken(oauthToken)
            .setDeveloperKey('API_KEY')
            .setCallback(pickerCallback)
            .build();
        picker.setVisible(true);
    }
}

function pickerCallback(data) {
    if (data.action === google.picker.Action.PICKED) {
        const fileId = data.docs[0].id;
        const fileName = data.docs[0].name;
        document.getElementById('arquivo-drive').value = `https://drive.google.com/file/d/${fileId}/view`;
        alert(`Arquivo selecionado: ${fileName}`);
    }
}

document.getElementById('drive-picker').addEventListener('click', loadPicker);
