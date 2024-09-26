import * as FileSystem from 'expo-file-system';
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import type { calloutGetLogResponse, loginResponse, tokenValidationResponse } from './responses';
import { calloutFromResponse } from '@/types/callout';
import type { callout } from '@/types/callout';
import type { patrol } from '@/types/patrol';

const local_server: string = 'http://192.168.1.120:8000';
const legacy_server: string = 'https://malibusarhours.org/calloutapi';
const dev_server: string = 'https://msar-dev-app.azurewebsites.net';
const staging_server: string = 'https://staging.app.malibusarhours.org';
const prod_server: string = 'https://app.malibusarhours.org';

export class Api {
  #_server = '';
  #token = '';
  constructor(server: string, token: string) {
    this.#_server = server;
    this.#token = token;
  }

  #server(): string {
    switch (this.#_server) {
      case 'local':
        return local_server;
      case 'legacy':
        return legacy_server;
      case 'dev':
        return dev_server;
      case 'staging':
        return staging_server;
    }
    return prod_server;
  }

  #tokenEndpoint(): string {
    return `${this.#server()}/api-token-auth/`;
  }

  #notificationsAvailableEndpoint(): string {
    return `${this.#server()}/api/event_notifications/`;
  }

  #radioChannelsAvailableEndpoint(): string {
    return `${this.#server()}/api/radio_channels/`;
  }

  #calloutsEndpoint(): string {
    return `${this.#server()}/api/callouts/`;
  }

  #chatEndpoint(): string {
    return `${this.#server()}/api/announcement/log/`;
  }

  #eventsEndpoint(): string {
    return `${this.#server()}/api/events/?is_operation=false`;
  }

  #patrolsEndpoint(): string {
    return `${this.#server()}/api/patrols/`;
  }

  #membersEndpoint(): string {
    return `${this.#server()}/api/members/`;
  }

  #devicesEndpoint(): string {
    return `${this.#server()}/api/devices/`;
  }

  #tokenValidationEndpoint(): string {
    return `${this.#server()}/api/?format=json`;
  }

  #filesEndpoint(): string {
    return `${this.#server()}/api/files/`;
  }

  #authorizationHeader() {
    if (!this.#token) {
      throw new Error('No token');
    }
    return `Token ${this.#token}`;
  }

  async #fetchWithCredentials(url: string, method: string = 'GET', body?: any, contentType?: string): Promise<any> {
    const options = {
      method,
      headers: {
        'Authorization': this.#authorizationHeader(),
        'Content-Type': contentType || 'application/json',
      },
      body: body || null,
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      const msg = await response.text();
      console.log(response.status, msg);
      throw new Error(`Network response was ${response.status}: ${msg}`);
    }
    return response;
  }

  async #fetchJsonWithCredentials(url: string, method: string = 'GET', body?: any): Promise<any> {
    const json_body = body ? JSON.stringify(body) : null;
    return (await this.#fetchWithCredentials(url, method, json_body)).json();
  }

  async downloadWithCredentials(url: string, destination: string) {
    const options = {
      headers: { Authorization: this.#authorizationHeader() },
    };
    return FileSystem.downloadAsync(url, destination, options);
  }

  async login(server: string, username: string, password: string): Promise<loginResponse> {
    this.#_server = server;
    return this.#apiGetToken(username, password);
  }

  async #apiGetToken(username: string, password: string): Promise<loginResponse> {
    return fetch(this.#tokenEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
        return {
          non_field_errors: [
            'Server Error',
          ],
        };
      });
  }

  async apiValidateToken(): Promise<tokenValidationResponse> {
    if (!this.#token) {
      return { valid_token: false };
    }

    return fetch(this.#tokenValidationEndpoint(), {
      method: 'GET',
      headers: {
        Authorization: `Token ${this.#token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return { valid_token: true };
        }
        else {
          return { valid_token: false };
        }
      // console.log("response status " + response.status);
      })
      .catch((error) => {
        console.log(error);
        return { valid_token: false };
      });
  }

  async apiGetNotificationsAvailable(): Promise<any> {
    return this.#fetchJsonWithCredentials(this.#notificationsAvailableEndpoint());
  }

  async apiGetRadioChannelsAvailable(): Promise<any> {
    return this.#fetchJsonWithCredentials(this.#radioChannelsAvailableEndpoint());
  }

  async apiGetCallouts(status?: string): Promise<any> {
    let args = '?ordering=-id';
    if (status) {
      args += `&status=${status}`;
    }

    return this.#fetchJsonWithCredentials(this.#calloutsEndpoint() + args);
  }

  async apiCreateCallout(callout: callout): Promise<any> {
    return this.#fetchJsonWithCredentials(this.#calloutsEndpoint(), 'POST', callout);
  }

  async apiGetCallout(id: number): Promise<any> {
    return this.#fetchJsonWithCredentials(`${this.#calloutsEndpoint() + id}/`).then((data) => {
      return calloutFromResponse(data);
    });
  }

  async apiUpdateCallout(id: number, callout: callout): Promise<any> {
    return this.#fetchJsonWithCredentials(
    `${(this.#calloutsEndpoint()) + id}/`,
    'PUT',
    callout,
    );
  }

  async apiRespondToCallout(id: number, response: string): Promise<any> {
    return this.#fetchJsonWithCredentials(
    `${(this.#calloutsEndpoint()) + id}/respond/`,
    'POST',
    {
      response,
    },
    );
  }

  async #apiGetLogResponseFromUrl(url: string, pageParam?: string): Promise<calloutGetLogResponse> {
    const fullUrl = pageParam || `${url}?ordering=-id`;
    console.log('full url', fullUrl);

    return this.#fetchJsonWithCredentials(fullUrl);
  }

  async apiGetCalloutLog(id: number, pageParam?: string): Promise<calloutGetLogResponse> {
    return this.#apiGetLogResponseFromUrl(`${this.#calloutsEndpoint() + id}/log/`, pageParam);
  }

  async apiGetChatLog(pageParam: string): Promise<calloutGetLogResponse> {
    return this.#apiGetLogResponseFromUrl(this.#chatEndpoint(), pageParam);
  }

  async #apiPostLogFromUrl(url: string, message: string): Promise<any> {
    return this.#fetchJsonWithCredentials(url, 'POST', {
      type: 'message',
      message,
    });
  }

  async apiPostCalloutLog(id: number, message: string): Promise<any> {
    return this.#apiPostLogFromUrl(`${this.#calloutsEndpoint() + id}/log/`, message);
  }

  async apiPostChatLog(message: string): Promise<any> {
    return this.#apiPostLogFromUrl(this.#chatEndpoint(), message);
  }

  async apiGetEvents(): Promise<any> {
    return this.#fetchJsonWithCredentials(this.#eventsEndpoint());
  }

  async apiGetPatrols(): Promise<any> {
    return this.#fetchJsonWithCredentials(this.#patrolsEndpoint());
  }

  async apiCreatePatrol(patrol: patrol): Promise<any> {
    const modified_patrol = { ...patrol, member: patrol.member?.id };
    return this.#fetchJsonWithCredentials(this.#patrolsEndpoint(), 'POST', modified_patrol);
  }

  async apiUpdatePatrol(id: number, patrol: patrol): Promise<any> {
    const modified_patrol = { ...patrol, member: patrol.member?.id };
    return this.#fetchJsonWithCredentials(
    `${(this.#patrolsEndpoint()) + id}/`,
    'PUT',
    modified_patrol,
    );
  }

  async apiGetMembers(): Promise<any> {
    return this.#fetchJsonWithCredentials(this.#membersEndpoint());
  }

  async apiSetDeviceId(token: string, active: boolean = true) {
    const tokenInfo = {
      name: Application.nativeApplicationVersion,
      registration_id: token,
      device_id: active ? 'msar' : 'msar-disabled',
      active,
      type: Platform.OS === 'ios' ? 'ios' : 'android',
    };

    try {
      const data = await this.#fetchJsonWithCredentials(
        this.#devicesEndpoint(),
        'POST',
        tokenInfo,
      );
      console.log(`assigned push token: ${JSON.stringify(data)}`);
    }
    catch (error) {
      console.log(`Error saving push token: ${error.message}`);
    }
  }

  async apiRemoveDeviceId(token: string) {
    try {
      const data = await this.#fetchWithCredentials(
      `${this.#devicesEndpoint() + token}/`,
      'DELETE',
      );
      console.log(`removed push token: ${JSON.stringify(data)}`);
    }
    catch (error) {
      console.log(error);
      // eslint-disable-next-line no-alert
      alert(`Error removing push token: ${error.message}`);
    }
  }

  async apiGetDeviceId(token: string): Promise<any> {
    if (!token)
      return Promise.reject(new Error('No token'));
    try {
      const data = await this.#fetchJsonWithCredentials(
      `${this.#devicesEndpoint() + token}/`,
      'GET',
      );
      console.log(`get push token: ${JSON.stringify(data)}`);
      return data;
    }
    catch (error) {
    // 404 indicates it is not stored.
      console.log(error);
      return Promise.reject(error);
    }
  }

  async apiIsDeviceIdActive(token: string): Promise<boolean> {
    const device = await this.apiGetDeviceId(token);
    return device.active;
  }

  async apiUpdateDeviceId(token: string) {
    this.apiGetDeviceId(token).then(
      (data) => {
        if (data.name !== Application.nativeApplicationVersion) {
          console.log('updating stored version');
          this.apiSetDeviceId(token, data.active);
        }
      },
      () => this.apiSetDeviceId(token, true),
    );
  }

  async apiUploadFile(file, id: string) {
    const body = new FormData();
    body.append('file', file);
    body.append('event', id);
    return this.#fetchWithCredentials(this.#filesEndpoint(), 'POST', body, 'multipart/form-data');
  }

  #apiGetDownloadFileUrl(id: number) {
    return `${this.#filesEndpoint() + id}/download/`;
  }

  async apiDownloadFile(id: number, destination: string) {
    return this.downloadWithCredentials(this.#apiGetDownloadFileUrl(id), destination);
  }
}
