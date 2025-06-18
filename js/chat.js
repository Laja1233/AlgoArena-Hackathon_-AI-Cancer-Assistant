
    const API_KEY = ""; // Your Gemini API Key
    

    const SYSTEM_PROMPT = `You are OMIC (Oncology & Medical Innovation Collaborator), an advanced AI clinical decision support system designed specifically for oncology healthcare professionals. You have access to comprehensive medical knowledge, clinical guidelines, research literature, and treatment protocols.

**Core Capabilities:**
- Multi-omics data interpretation (genomics, proteomics, metabolomics)
- Evidence-based treatment recommendation analysis
- Clinical trial matching and eligibility assessment
- Drug interaction and contraindication analysis
- Prognostic factor evaluation
- Biomarker interpretation and clinical significance
- Personalized treatment pathway suggestions
- Risk stratification and outcome prediction

**Response Framework:**
1. **Clinical Assessment**: Analyze the presented case systematically
2. **Evidence Review**: Reference current guidelines (NCCN, ASCO, ESMO) and recent literature
3. **Risk-Benefit Analysis**: Evaluate treatment options with careful consideration of patient factors
4. **Recommendations**: Provide evidence-based suggestions with confidence levels
5. **Monitoring Plan**: Suggest follow-up protocols and key parameters to track
6. **Additional Considerations**: Include relevant clinical trials, genetic testing, or specialist referrals

**Important Guidelines:**
- Always emphasize that recommendations require validation by qualified oncologists
- Include confidence levels and evidence quality for all suggestions
- Highlight when additional testing or specialist consultation is needed
- Consider patient comorbidities, performance status, and individual circumstances
- Reference specific guidelines and studies when applicable
- Acknowledge limitations and areas of uncertainty

**Safety Protocols:**
- Never provide direct patient care instructions
- Always recommend consultation with qualified healthcare professionals
- Flag emergency situations requiring immediate medical attention
- Clearly state when cases are outside typical parameters

Begin each response with: "🧬 OMIC Clinical Analysis" and end with a disclaimer about professional medical oversight requirement.`;

    let chatHistory = [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "🧬 OMIC Clinical Analysis system activated. I'm ready to assist with oncology clinical cases and provide evidence-based insights. How can I help with your clinical scenario today?" }] }
    ]; 


    function scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function displayMessage(message, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message');
        messageBubble.classList.add(sender === 'user' ? 'user' : 'bot');
        messageBubble.innerHTML = message.replace(/\n/g, '<br>');
        chatMessages.appendChild(messageBubble);
        scrollToBottom();
    }

    function toggleLoading(show) {
        const sendButton = document.getElementById('sendButton');
        if (sendButton) {
            sendButton.disabled = show;
            sendButton.textContent = show ? 'Analyzing...' : 'Send';
        }
    }
    async function sendMessageToGemini(userMessage) {
        toggleLoading(true);
        chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
        displayMessage(userMessage, 'user');

        const payload = { contents: chatHistory };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error:", errorData);
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const botResponse = result.candidates[0].content.parts[0].text;
                chatHistory.push({ role: "model", parts: [{ text: botResponse }] });
                displayMessage(botResponse, 'bot');
            } else {
                displayMessage("🧬 OMIC Clinical Analysis: I apologize, but I couldn't process that request. Please try rephrasing your clinical question or case details.\n\n⚠️ This recommendation requires validation by qualified oncologists.", 'bot');
                console.error("Unexpected API response structure:", result);
            }
        } catch (error) {
            console.error("Error communicating with Gemini API:", error);
            displayMessage("🧬 OMIC Clinical Analysis: I'm experiencing technical difficulties. Please try again or consult with your healthcare team directly.\n\n⚠️ This recommendation requires validation by qualified oncologists.", 'bot');
        } finally {
            toggleLoading(false);
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        const sendButton = document.getElementById('sendButton');
        const chatInput = document.getElementById('chatInput');
        if (sendButton) {
            sendButton.addEventListener('click', () => {
                const message = chatInput?.value?.trim();
                if (message) {
                    sendMessageToGemini(message);
                    chatInput.value = '';
                }
            });
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    sendButton?.click();
                }
            });
        }

        setTimeout(() => {
            displayMessage("🧬 OMIC Clinical Analysis system is active. I'm ready to assist with oncology cases, treatment analysis, and clinical decision support. Please describe your clinical scenario.\n\n⚠️ All recommendations require validation by qualified oncologists.", 'bot');
        }, 1000);
    });

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }
    window.copyPrompt = function() {
        const copyButton = document.querySelector('.copy-button');
        const copyStatus = document.getElementById('copyStatus');
        
        if (copyButton && copyStatus) {
            copyButton.textContent = '✅ OMIC is Already Active!';
            copyButton.classList.add('copied');
            copyStatus.textContent = 'OMIC system is pre-loaded and ready to use in the chat below.';
            copyStatus.classList.add('show');
            setTimeout(() => {
                copyButton.textContent = '🤖 OMIC Ready';
                copyButton.classList.remove('copied');
                copyStatus.classList.remove('show');
            }, 3000);
        }
    };
