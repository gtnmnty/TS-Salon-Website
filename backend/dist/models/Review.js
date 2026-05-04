"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    initial: { type: String, required: true },
    name: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true }
});
exports.Review = (0, mongoose_1.model)('Review', reviewSchema);
//# sourceMappingURL=Review.js.map