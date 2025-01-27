import * as all from '@actions/github';

import { createReport } from '../../src/stages/createReport';
import { createRunReport } from '../../src/stages/createRunReport';
import { JsonReport } from '../../src/typings/JsonReport';
import { Options } from '../../src/typings/Options';
import { createDataCollector } from '../../src/utils/DataCollector';
import report from '../mock-data/jsonReport.json';

const { mockContext, clearContextMock } = all as any;

const DEFAULT_OPTIONS: Options = {
    token: '',
    testScript: '',
    iconType: 'emoji',
    annotations: 'all',
    packageManager: 'npm',
    skipStep: 'all',
    prNumber: 5,
    pullRequest: {
        number: 5,
        head: {
            sha: '123456',
            ref: '123',
            repo: { clone_url: 'https://github.com/test/repo.git' },
        },
        base: {
            sha: '256',
            ref: '456',
            repo: { clone_url: 'https://github.com/test/repo.git' },
        },
    },
    output: ['comment'],
    owner: 'bot',
    repo: 'test-repo',
    sha: '123',
};

describe('createReport', () => {
    it('should match snapshots', async () => {
        const dataCollector = createDataCollector<JsonReport>();
        dataCollector.add(report);

        mockContext({ payload: { after: '123456' } });
        expect(
            await createReport(
                dataCollector,
                createRunReport(report),
                {
                    ...DEFAULT_OPTIONS,
                    workingDirectory: 'custom directory',
                },
                []
            )
        ).toMatchSnapshot();
        expect(
            await createReport(
                dataCollector,
                createRunReport(report),
                DEFAULT_OPTIONS,
                []
            )
        ).toMatchSnapshot();

        expect(
            await createReport(
                dataCollector,
                createRunReport(report),
                {
                    ...DEFAULT_OPTIONS,
                    workingDirectory: 'directory',
                    customTitle: 'Custom title with directory - {{ dir }}',
                },
                []
            )
        ).toMatchSnapshot();

        clearContextMock();
    });

    it('should match snapshots (failed report)', async () => {
        const dataCollector = createDataCollector<JsonReport>();
        dataCollector.add({ ...report, success: false });

        mockContext({ payload: { after: '123456' } });

        expect(
            await createReport(
                dataCollector,
                createRunReport({ ...report, success: false }),
                DEFAULT_OPTIONS,
                []
            )
        ).toMatchSnapshot();

        clearContextMock();
    });
});
