import classNames from 'classnames';
import React, {
  TextareaHTMLAttributes,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import useBaseValue from './hooks/useBaseValue';
import useCursor from './hooks/useCursor';
import usePreviewElement, {
  previewElementOptions,
} from './hooks/usePreviewElement';
import './index.scss';

export interface HighlightTextareaRef {
  /** 编辑器 */
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  /** 展示文字的容器 */
  textRef: React.RefObject<HTMLDivElement>;
  /** 整体框架 */
  containerRef: React.RefObject<HTMLDivElement>;
}

export type HighlightTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value'
> &
  previewElementOptions;
/**
 * 支持错误文案高亮，以及的输入框
 *
 */
const HighlightTextarea = forwardRef<
  HighlightTextareaRef,
  HighlightTextareaProps
>(
  (
    {
      className,
      style,
      value = '',
      onChange,
      highlight,
      formatHighlight,
      ...resetProps
    },
    ref,
  ) => {
    /** 暴露给外部 */
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(
      ref,
      () => ({
        textareaRef,
        textRef,
        containerRef,
      }),
      [],
    );

    /** 兼容不传递 value 时的情况 */
    const { currentValue, handlerChange } = useBaseValue({ value, onChange });

    /** 展示数据 */
    const { element, elementList } = usePreviewElement({
      value: currentValue,
      highlight,
      formatHighlight,
    });

    /** 处理光标问题 */
    const { handlerContainerClick, handlerBoxClick } = useCursor({
      value: currentValue,
      textareaRef,
      elementList,
    });

    return (
      <div
        className={classNames('highlight-textarea-container', className)}
        style={style}
        onClick={handlerContainerClick}
        ref={containerRef}
      >
        <div className="highlight-textarea">
          <textarea
            {...resetProps}
            className="highlight-textarea-textarea"
            onChange={handlerChange}
            value={currentValue}
            ref={textareaRef}
          />
          <div
            className="highlight-textarea-box"
            onClick={handlerBoxClick}
            contentEditable="plaintext-only"
            suppressContentEditableWarning
            ref={textRef}
          >
            {element}
          </div>
        </div>
      </div>
    );
  },
);
export default HighlightTextarea;
