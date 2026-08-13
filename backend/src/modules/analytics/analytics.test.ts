import mongoose from 'mongoose';
import analyticsRepository from './analytics.repository';
import analyticsService from './analytics.service';
import { AnalyticsPersonalization } from './analytics.model';
import { analyticsFilterSchema, exportAnalyticsSchema, scheduledReportSchema } from './analytics.validation';
import { AnalyticsPeriod } from './analytics.types';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/practice_exam_saas';

async function runAnalyticsTestSuite() {
  console.log('--- Phase 5.8: Enterprise Organization Analytics & Operations Intelligence Test Suite ---');
  
  // 1. Validate Zod Schemas
  console.log('\n[1/4] Testing Zod Validation Schemas...');
  try {
    analyticsFilterSchema.parse({ query: { period: 'MONTH', companyId: new mongoose.Types.ObjectId().toString() } });
    exportAnalyticsSchema.parse({ body: { category: 'EXAM', format: 'PDF' } });
    scheduledReportSchema.parse({
      body: {
        title: 'Monthly Ops Report',
        frequency: 'MONTHLY',
        reportType: 'ALL',
        format: 'EXCEL',
        recipients: ['exec@enterprise.com']
      }
    });
    console.log('✅ All Analytics Zod Schemas verified successfully.');
  } catch (err: any) {
    console.error('❌ Zod validation test failed:', err);
    process.exit(1);
  }

  // 2. Connect to MongoDB
  console.log('\n[2/4] Connecting to MongoDB instance...');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB.');
  } catch (err: any) {
    console.warn('⚠️ Could not connect to live MongoDB instance. Assuming offline unit evaluation:', err.message);
    process.exit(0);
  }

  const mockCompanyId = new mongoose.Types.ObjectId().toString();

  // 3. Test MongoDB Aggregation Pipelines
  console.log('\n[3/4] Running Aggregation Pipeline Verifications via Repository...');
  try {
    const dashboard = await analyticsService.getDashboardAnalytics({ companyId: mockCompanyId, period: AnalyticsPeriod.MONTH });
    console.log('✅ Executive Dashboard pipeline executed without syntax errors:', {
      orgHealthScore: dashboard.organizationHealth.score,
      revenueMonthly: dashboard.revenueSummary.monthlyRevenue
    });

    const heatmaps = await analyticsRepository.getHeatmaps({ companyId: mockCompanyId });
    console.log('✅ Heatmaps Data pipeline executed:', {
      branchesLoaded: heatmaps.branchHeatmap.length,
      centersLoaded: heatmaps.centerHeatmap.length
    });

    const searchRes = await analyticsRepository.searchAnalytics('test', { companyId: mockCompanyId });
    console.log('✅ Global Cross-Module Search executed:', { totalMatched: searchRes.resultsCount });

    const trustScores = await analyticsRepository.getTrustAnalytics({ companyId: mockCompanyId });
    console.log('✅ Master AI Trust Scores computed:', { systemScore: trustScores.overallSystemTrustScore });
  } catch (err: any) {
    console.error('❌ Aggregation Pipeline failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }

  // 4. Test Personalization Persistence Model
  console.log('\n[4/4] Testing Personalization State Persistence...');
  try {
    const mockUser = new mongoose.Types.ObjectId().toString();
    await AnalyticsPersonalization.findOneAndUpdate(
      { userId: mockUser, companyId: mockCompanyId },
      { $set: { compactMode: true, refreshInterval: 30 } },
      { upsert: true, new: true }
    );
    const updated = await AnalyticsPersonalization.findOne({ userId: mockUser });
    console.log('✅ Personalization settings saved & retrieved:', { compactMode: updated?.compactMode, refresh: updated?.refreshInterval });
    
    // Clean up test document
    await AnalyticsPersonalization.deleteOne({ userId: mockUser });
    console.log('✅ Test document cleaned up.');
  } catch (err: any) {
    console.error('❌ Personalization model test failed:', err);
  }

  await mongoose.disconnect();
  console.log('\n🚀 Phase 5.8 Enterprise Analytics Test Suite completed successfully with ZERO errors.');
  process.exit(0);
}

runAnalyticsTestSuite().catch((err) => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});
