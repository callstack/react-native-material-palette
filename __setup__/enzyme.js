/* eslint-disable import/no-extraneous-dependencies */

import { configure } from 'enzyme';
import Adapter from 'enzyme/build/adapters/ReactSixteenAdapter';

configure({ adapter: new Adapter() });
