/**
 * TutorialEngine - Pure state machine for tutorial progression
 * Manages chapters, steps, events, and experiment state with zero DOM knowledge
 */

export class TutorialEngine {
  constructor(tutorialData, originalState) {
    this.tutorialData = tutorialData;
    this.originalState = JSON.parse(JSON.stringify(originalState)); // Deep clone
    this.chapterIndex = 0;
    this.stepIndex = 0;
    this.listeners = {}; // Event listeners map
  }

  /**
   * Event emitter - register listener
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Event emitter - remove listener
   */
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  /**
   * Event emitter - emit event
   */
  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }

  /**
   * Start the tutorial - emits tutorial-start then first step-change
   */
  start() {
    this.chapterIndex = 0;
    this.stepIndex = 0;
    this.emit('tutorial-start');
    this._emitStepChange();
    this._saveProgress();
  }

  /**
   * Navigate to next step
   */
  next() {
    const currentChapter = this.tutorialData.chapters[this.chapterIndex];
    const isLastStepInChapter = this.stepIndex === currentChapter.steps.length - 1;
    const isLastChapter = this.chapterIndex === this.tutorialData.chapters.length - 1;

    if (isLastStepInChapter) {
      if (isLastChapter) {
        // At the last step of the last chapter - emit tutorial-end
        this.emit('tutorial-end');
        sessionStorage.removeItem('tutorial-progress');
        return;
      } else {
        // Move to first step of next chapter
        this.chapterIndex++;
        this.stepIndex = 0;
        this.emit('chapter-change', this._getChapterData());
      }
    } else {
      // Move to next step in current chapter
      this.stepIndex++;
    }

    this._emitStepChange();
    this._saveProgress();
  }

  /**
   * Navigate to previous step
   */
  prev() {
    const isFirstStepInChapter = this.stepIndex === 0;
    const isFirstChapter = this.chapterIndex === 0;

    if (isFirstStepInChapter) {
      if (isFirstChapter) {
        // Already at first step - stay here
        return;
      } else {
        // Move to last step of previous chapter
        this.chapterIndex--;
        const prevChapter = this.tutorialData.chapters[this.chapterIndex];
        this.stepIndex = prevChapter.steps.length - 1;
        this.emit('chapter-change', this._getChapterData());
      }
    } else {
      // Move to previous step in current chapter
      this.stepIndex--;
    }

    this._emitStepChange();
    this._saveProgress();
  }

  /**
   * Jump to a specific chapter (first step)
   */
  goToChapter(index) {
    if (index < 0 || index >= this.tutorialData.chapters.length) {
      return; // Invalid index
    }

    this.chapterIndex = index;
    this.stepIndex = 0;
    this.emit('chapter-change', this._getChapterData());
    this._emitStepChange();
    this._saveProgress();
  }

  /**
   * Reset to the original state snapshot
   */
  resetToOriginal() {
    return JSON.parse(JSON.stringify(this.originalState)); // Return deep clone
  }

  /**
   * Resume tutorial at specific chapter and step
   */
  resumeAt(chapterIndex, stepIndex) {
    this.chapterIndex = chapterIndex;
    this.stepIndex = stepIndex;
    this._emitStepChange();
  }

  /**
   * Get current chapter data
   */
  _getChapterData() {
    const chapter = this.tutorialData.chapters[this.chapterIndex];
    return {
      chapterIndex: this.chapterIndex,
      title: chapter.title,
      totalSteps: chapter.steps.length,
      currentStepInChapter: this.stepIndex + 1
    };
  }

  /**
   * Get current step data and emit step-change
   */
  _emitStepChange() {
    const chapter = this.tutorialData.chapters[this.chapterIndex];
    const step = chapter.steps[this.stepIndex];

    const stepData = {
      chapterIndex: this.chapterIndex,
      chapterTitle: chapter.title,
      stepIndex: this.stepIndex,
      stepInChapter: this.stepIndex + 1,
      totalStepsInChapter: chapter.steps.length,
      factorId: step.factorId,
      action: step.action,
      narrative: step.narrative,
      scenarioContext: step.scenarioContext || null,
      whyTheseNumbers: step.whyTheseNumbers || null,
      experiment: step.experiment || null
    };

    this.emit('step-change', stepData);
  }

  /**
   * Save progress to sessionStorage
   */
  _saveProgress() {
    const progress = {
      tutorialId: this.tutorialData.id,
      chapterIndex: this.chapterIndex,
      stepIndex: this.stepIndex,
      timestamp: Date.now()
    };
    sessionStorage.setItem('tutorial-progress', JSON.stringify(progress));
  }
}
