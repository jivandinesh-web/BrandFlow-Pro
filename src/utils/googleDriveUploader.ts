/**
 * Google Drive integration for saving the SOP Document directly to Google Drive
 */

import firebaseConfig from '../../firebase-applet-config.json';

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (tokenResponse: { access_token?: string; error?: string }) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
    };
    gapi?: unknown;
  }
}

export async function uploadSopToGoogleDrive(onProgress?: (msg: string) => void): Promise<{ fileId: string; webViewLink: string }> {
  onProgress?.('Fetching SOP Document...');
  
  // 1. Fetch the docx file binary
  const response = await fetch('/BrandFlow_Pro_Standard_Operating_Procedure.docx');
  if (!response.ok) {
    throw new Error('Failed to load the SOP Document from server');
  }
  const blob = await response.blob();

  // 2. Load Google Identity Services library if not loaded
  if (!window.google?.accounts?.oauth2) {
    onProgress?.('Loading Google Identity Services...');
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.body.appendChild(script);
    });
  }

  // 3. Request Access Token from the user
  onProgress?.('Requesting Google Drive authorization...');
  const clientId = firebaseConfig.oAuthClientId || '239737521583-rk9t4j43kstiuji1pfv4tcj8h3hufivh.apps.googleusercontent.com';
  const accessToken = await new Promise<string>((resolve, reject) => {
    try {
      const tokenClient = window.google!.accounts!.oauth2!.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error));
          } else if (tokenResponse.access_token) {
            resolve(tokenResponse.access_token);
          } else {
            reject(new Error('Failed to obtain Google Drive token'));
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
      reject(err);
    }
  });

  // 4. Upload multipart/related to Google Drive API v3
  onProgress?.('Uploading SOP document to Google Drive...');
  const metadata = {
    name: 'BrandFlow_Pro_Standard_Operating_Procedure.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', blob);

  const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });

  if (!uploadRes.ok) {
    const errorBody = await uploadRes.text();
    throw new Error(`Google Drive API error: ${errorBody}`);
  }

  const fileData = await uploadRes.json();
  return {
    fileId: fileData.id,
    webViewLink: fileData.webViewLink || `https://drive.google.com/file/d/${fileData.id}/view`,
  };
}
