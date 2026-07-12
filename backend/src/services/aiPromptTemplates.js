/**
 * AI Prompt Templates for Procurement Copilot
 */
module.exports = {
    compareQuotes: (rfq, quotations) => `
    You are an expert Strategic Procurement AI Copilot. 
    Analyze the following RFQ and its submitted vendor quotations.

    RFQ: ${rfq.title}
    Description: ${rfq.description}
    Budget: ${rfq.budget}
    Quantity: ${rfq.quantity} ${rfq.unit}

    Quotations:
    ${quotations.map(q => `- Vendor: ${q.vendor?.name}, Price: ${q.price}, Delivery: ${q.deliveryDays} days, Notes: ${q.notes}, Rating: ${q.vendor?.rating}, Reliability: ${q.vendor?.onTimeDelivery}%`).join('\n')}

    Please provide:
    1. Cost Analysis (Savings vs Budget).
    2. Risk Analysis (Delivery risk, price outliers, vendor reliability).
    3. Negotiation Suggestions (Specific points for the top vendors).
    4. Recommendation (Best vendor with rationale).

    Output must be in valid JSON format.
  `
};
