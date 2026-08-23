/* ==========================================================================
   FAQ Accordion Widget — logic
   - Renders FAQ items from a data array
   - Toggles open/close state, animating real content height
   - Only one panel open at a time (classic accordion behaviour)
   ========================================================================== */

(function () {
  "use strict";

  /**
   * Edit this array to change the questions/answers shown.
   * Each item just needs a `question` and an `answer`.
   */
  const FAQ_DATA = [
    {
      question: "What is the SyntecxHub internship program?",
      answer:
        "It's a hands-on program where you complete real front-end projects, " +
        "receive weekly tasks, and get mentorship to build practical, " +
        "portfolio-ready skills.",
    },
    {
      question: "How many projects do I need to submit?",
      answer:
        "At least one project per weekly task is required. Completing more " +
        "than one is optional, but it's a great way to show initiative.",
    },
    {
      question: "Where do I submit my completed work?",
      answer:
        "Upload your full source code to a GitHub repository named " +
        "Syntecxhub_Project_Name, then submit the repository link through " +
        "the official submission form.",
    },
    {
      question: "What happens if I miss a weekly task?",
      answer:
        "Completing all assigned weekly tasks is mandatory. If required " +
        "projects aren't finished, the internship is marked incomplete and " +
        "no certificate is issued.",
    },
    {
      question: "Do I need to post about my internship online?",
      answer:
        "Yes — sharing your internship status on LinkedIn and mentioning " +
        "@Syntecxhub is part of the program's instructions.",
    },
  ];

  const accordionEl = document.getElementById("accordion");
  const itemTemplate = document.getElementById("itemTemplate");

  init();

  function init() {
    FAQ_DATA.forEach((item, index) => {
      accordionEl.appendChild(buildItem(item, index));
    });
  }

  /**
   * Build a single <li> accordion item from the template and wire up
   * its click behaviour.
   */
  function buildItem(item, index) {
    const fragment = itemTemplate.content.cloneNode(true);

    const trigger = fragment.querySelector(".accordion__trigger");
    const indexEl = fragment.querySelector(".accordion__index");
    const questionEl = fragment.querySelector(".accordion__question");
    const panel = fragment.querySelector(".accordion__panel");
    const answerEl = fragment.querySelector(".accordion__answer");

    const panelId = `faq-panel-${index}`;
    const triggerId = `faq-trigger-${index}`;

    indexEl.textContent = String(index + 1).padStart(2, "0");
    questionEl.textContent = item.question;
    answerEl.textContent = item.answer;

    trigger.id = triggerId;
    trigger.setAttribute("aria-controls", panelId);
    panel.id = panelId;
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-labelledby", triggerId);

    trigger.addEventListener("click", () => toggleItem(trigger, panel));

    return fragment;
  }

  /**
   * Open the clicked panel (animating to its real content height) and
   * close any other open panel, accordion-style.
   */
  function toggleItem(trigger, panel) {
    const isOpen = trigger.getAttribute("aria-expanded") === "true";

    // Close every other open panel first.
    accordionEl.querySelectorAll('.accordion__trigger[aria-expanded="true"]').forEach((otherTrigger) => {
      if (otherTrigger !== trigger) {
        const otherPanel = document.getElementById(otherTrigger.getAttribute("aria-controls"));
        closePanel(otherTrigger, otherPanel);
      }
    });

    if (isOpen) {
      closePanel(trigger, panel);
    } else {
      openPanel(trigger, panel);
    }
  }

  function openPanel(trigger, panel) {
    trigger.setAttribute("aria-expanded", "true");
    const contentHeight = panel.querySelector(".accordion__panel-inner").offsetHeight;
    panel.style.height = contentHeight + "px";

    // Once the transition completes, allow the panel to grow naturally
    // (in case content reflows on resize) by switching to "auto".
    panel.addEventListener("transitionend", function handler(e) {
      if (e.propertyName === "height" && trigger.getAttribute("aria-expanded") === "true") {
        panel.style.height = "auto";
      }
      panel.removeEventListener("transitionend", handler);
    });
  }

  function closePanel(trigger, panel) {
    // If height is "auto", snap it to its pixel value first so the
    // transition back to 0 has something to animate from.
    if (panel.style.height === "auto" || !panel.style.height) {
      panel.style.height = panel.scrollHeight + "px";
      // Force reflow so the browser registers the starting height.
      // eslint-disable-next-line no-unused-expressions
      panel.offsetHeight;
    }
    trigger.setAttribute("aria-expanded", "false");
    panel.style.height = "0px";
  }
})();