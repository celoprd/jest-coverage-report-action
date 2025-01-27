import { CreateCheckOptions } from './CreateCheckOptions';
import { Annotation } from '../../annotations/Annotation';
import { Options } from '../../typings/Options';
import { i18n } from '../../utils/i18n';

export const formatCoverageAnnotations = (
    annotations: Array<Annotation>,
    options: Options
): CreateCheckOptions => ({
    repo: options.repo,
    owner: options.owner,
    status: 'completed',
    head_sha: options.sha,
    conclusion: 'success',
    name: i18n('coveredCheckName'),
    output: {
        title: i18n('coverageTitle'),
        summary: i18n('coverageAnnotations'),
        text: [
            i18n('coverageAnnotationsText'),
            annotations.length > 50 &&
                i18n('tooMuchAnnotations', {
                    hiddenCount: annotations.length - 50,
                }),
        ]
            .filter(Boolean)
            .join('\n'),
        annotations: annotations.slice(0, 49),
    },
});
