import axios from 'axios';
import { Log } from './log';

const log = new Log('ExistClient');

const baseUrl = 'https://exist.io/api/1/';

class ExistClient {
  public async getUserData(accessToken: string): Promise<any> {
    return await this.sendRequest('users/$self/today', accessToken);
  }

  public async acquireAttribute(accessToken: string, attributeName: string, active: boolean = true): Promise<void> {
    return await this.sendRequest('attributes/acquire/', accessToken, [{ name: attributeName, active }]);
  }

  public async updateMoneySpent(
    accessToken: string,
    attributeParams: ExistClient.INumericUserAttributeValue[],
  ): Promise<void> {
    // Make sure we have control of the attribute first.
    await this.acquireAttribute(accessToken, 'money_spent');

    const attributes: ExistClient.IUserAttribute[] = attributeParams.map((attribute) => {
      return { ...attribute, name: 'money_spent' };
    });

    return await this.sendRequest('attributes/update/', accessToken, attributes);
  }

  private async sendRequest(url: string, accessToken: string, data?: any): Promise<any> {
    const options = {
      data,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: data ? 'POST' : 'GET',
    };
    log.info(options);
    const result = await axios(`${baseUrl}${url}`, options);

    return result;
  }
}

namespace ExistClient {
  export type IUserAttribute = (INumericUserAttributeValue | IStringUserAttributeValue) & { name: string };

  export interface INumericUserAttributeValue {
    date: string; // YYYY-mm-dd
    value: number;
  }

  export interface IStringUserAttributeValue {
    date: string; // YYYY-mm-dd
    value: string;
  }
}

export { ExistClient };

export default new ExistClient();
