import { Block } from '@sanity/types';
import DefaultButton from 'part:@sanity/components/buttons/default';
import DefaultSelect from 'part:@sanity/components/selects/default';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './TextToSpeechPreview.css';

const defaultFields = ['title', 'excerpt', 'body'];
const speechOptions = { rate: 0.9, pitch: 1, lang: 'en-US' };

const speechSynth = 'speechSynthesis' in window ? window.speechSynthesis : null;

const blocksToText = (blocks: Block<any>[], opts = {}) => {
  const defaultBehaviors = { nonTextBehavior: 'remove' };
  const options = Object.assign({}, defaultBehaviors, opts);
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return options.nonTextBehavior === 'remove'
          ? ''
          : `[${block._type} block]`;
      }
      return block.children.map((child) => child.text).join('');
    })
    .join('\n\n');
};

// eslint-disable-next-line react/require-optimization
class TextToSpeechPreview extends React.Component<any> {
  static propTypes = {
    document: PropTypes.object,
    options: PropTypes.shape({
      fields: PropTypes.array,
    }),
  };

  static defaultProps = {
    document: null,
    fields: null,
  };

  state = {
    activeField: null,
  };

  // Only offer to speak fields which have any data
  fieldsAvailableForUtterance = () => {
    const { fields } = this.props.options;
    const { displayed } = this.props.document;
    return (fields || defaultFields).filter(
      (field: string) => !!displayed[field]
    );
  };

  textToSpeak() {
    const { activeField } = this.state;
    const { displayed } = this.props.document;

    if (!activeField) {
      return null;
    }

    if (typeof displayed[activeField as unknown as string] === 'string') {
      return displayed[activeField as unknown as string];
    }
    // we're in Portable Text now, digging into blocks
    return blocksToText(displayed[activeField as unknown as string]);
  }

  handleFieldChange = (field: any) => {
    speechSynth?.cancel();
    this.setState({ activeField: field.title });
  };

  handleStartSpeaking = () => {
    const { pitch, rate, lang } = speechOptions;
    // eslint-disable-next-line no-undef
    const utterance = new SpeechSynthesisUtterance(this.textToSpeak());
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.lang = lang;
    speechSynth?.speak(utterance);
  };

  handleStopSpeaking = () => {
    speechSynth?.cancel();
  };
  // componentWillMount is deprecated since React 16.9.0, using UNSAFE_componentWillMount instead
  UNSAFE_componentWillMount = () => {
    this.setState({ activeField: this.fieldsAvailableForUtterance()[0] });
  };

  componentDidUpdate() {
    if (speechSynth?.speaking) {
      this.handleStopSpeaking();
      this.handleStartSpeaking();
    }
  }

  componentWillUnmount() {
    this.handleStopSpeaking();
  }

  render() {
    if (!speechSynth) {
      return (
        <div className={styles.wrapper}>
          Unfortunately your browser does not support the Web Speech API.
        </div>
      );
    }

    const { activeField } = this.state;

    // DefaultSelect wants objects, let's make some of those
    const fieldObjects = this.fieldsAvailableForUtterance().map(
      (field: string) => ({
        title: field,
      })
    );
    const activeFieldObject = fieldObjects.find(
      (obj: any) => obj.title === activeField
    );

    if (fieldObjects) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.selectionWrapper}>
            <DefaultSelect
              items={fieldObjects}
              value={activeFieldObject}
              onChange={this.handleFieldChange}
            />
            <DefaultButton
              color={'primary'}
              onClick={() => this.handleStartSpeaking()}
            >
              Play
            </DefaultButton>
            <DefaultButton
              color={'danger'}
              onClick={() => this.handleStopSpeaking()}
            >
              Stop
            </DefaultButton>
          </div>
          <h3 className={styles.transcriptHeading}>Transcript</h3>
          <p className={styles.transcriptBody}>{this.textToSpeak()}</p>
        </div>
      );
    }

    return (
      <div className={styles.wrapper}>
        The <code>options</code> constant defines which fields can be uttered.
        Make sure the current document has a value for these fields.
      </div>
    );
  }
}

export default TextToSpeechPreview;
