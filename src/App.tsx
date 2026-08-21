import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './lib/firebase';
import { Customer, Job, ModuleType, UserRole } from './types';
import { INITIAL_ASSETS, INITIAL_CUSTOMERS, INITIAL_JOBS } from './data/mockData';
import { triggerStatusNotification } from './utils/notificationHelper';
import { DesktopFrame } from './components/DesktopFrame';
import { ToolbarHeader } from './components/ToolbarHeader';
import { WorkflowTracker } from './components/WorkflowTracker';

import { DashboardModule } from './components/modules/DashboardModule';
import { CustomersModule } from './components/modules/CustomersModule';
import { QuotationsModule } from './components/modules/QuotationsModule';
import { ClientQuoteModule } from './components/modules/ClientQuoteModule';
import { ApprovalModule } from './components/modules/ApprovalModule';
import { ArtworkUploadModule } from './components/modules/ArtworkUploadModule';
import { DesignModule } from './components/modules/DesignModule';
import { PdfProofApprovalModule } from './components/modules/PdfProofApprovalModule';
import { ProductionModule } from './components/modules/ProductionModule';
import { QualityControlModule } from './components/modules/QualityControlModule';
import { AccountsModule } from './components/modules/AccountsModule';
import { PaymentTrackingModule } from './components/modules/PaymentTrackingModule';
import { DispatchModule } from './components/modules/DispatchModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { AssetLibraryModule } from './components/modules/AssetLibraryModule';
import { UserManagementModule } from './components/modules/UserManagementModule';
import { SettingsModule } from './components/modules/SettingsModule';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('Dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('Admin');
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<Job>(INITIAL_JOBS[0]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  useEffect(() => {
    // Sync Jobs
    const unsubscribeJobs = onSnapshot(collection(db, 'jobs'), async (snapshot) => {
      if (snapshot.empty) {
        // Seed if empty
        const batch = writeBatch(db);
        INITIAL_JOBS.forEach((job) => {
          const jobRef = doc(db, 'jobs', job.id);
          batch.set(jobRef, job);
        });
        await batch.commit();
      } else {
        const jobsData = snapshot.docs.map(doc => doc.data() as Job);
        // Sort jobs by descending order of dateCreated or just keep them as they are
        setJobs(jobsData);
        if (jobsData.length > 0) {
          // Keep the current selected job if it exists in the new data, otherwise select the first one
          setSelectedJob((prev) => {
            const stillExists = jobsData.find((j) => j.id === prev.id);
            return stillExists || jobsData[0];
          });
        }
      }
    });

    // Sync Customers
    const unsubscribeCustomers = onSnapshot(collection(db, 'customers'), async (snapshot) => {
      if (snapshot.empty) {
        // Seed if empty
        const batch = writeBatch(db);
        INITIAL_CUSTOMERS.forEach((customer) => {
          const customerRef = doc(db, 'customers', customer.id);
          batch.set(customerRef, customer);
        });
        await batch.commit();
      } else {
        const customersData = snapshot.docs.map(doc => doc.data() as Customer);
        setCustomers(customersData);
      }
    });

    return () => {
      unsubscribeJobs();
      unsubscribeCustomers();
    };
  }, []);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  const handleSaveJob = async (updatedJob: Job, previousJob?: Job) => {
    try {
      await setDoc(doc(db, 'jobs', updatedJob.id), updatedJob);
      setSelectedJob(updatedJob);
      triggerStatusNotification({
        job: updatedJob,
        newStatus: updatedJob.stage,
        onNotify: showNotification,
      });
    } catch (error) {
      console.error('Error saving job to Firebase:', error);
      showNotification('Error saving job to database.');
    }
  };

  const handleAddCustomer = async (newCustomer: Customer) => {
    try {
      await setDoc(doc(db, 'customers', newCustomer.id), newCustomer);
      showNotification(`New customer profile #${newCustomer.code} (${newCustomer.company}) created successfully!`);
    } catch (error) {
      console.error('Error adding customer to Firebase:', error);
      showNotification('Error saving customer to database.');
    }
  };

  const handleUpdateCustomer = async (updatedCustomer: Customer) => {
    try {
      await setDoc(doc(db, 'customers', updatedCustomer.id), updatedCustomer);
      showNotification(`Customer profile #${updatedCustomer.code} (${updatedCustomer.company}) updated successfully!`);
    } catch (error) {
      console.error('Error updating customer in Firebase:', error);
      showNotification('Error updating customer in database.');
    }
  };

  const handleNavigate = (mod: ModuleType) => {
    setActiveModule(mod);
  };

  return (
    <DesktopFrame
      activeModule={activeModule}
      setActiveModule={setActiveModule}
      currentRole={currentRole}
      notificationMsg={notificationMsg}
    >
      {/* Top Department Toolbar (Contains mandatory EDIT, PRINT, SAVE 3 buttons & Role switcher) */}
      <ToolbarHeader
        activeModule={activeModule}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        selectedJob={selectedJob}
        allJobs={jobs}
        setSelectedJob={setSelectedJob}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onSaveNotification={showNotification}
      />

      {/* Global Workflow Step Pipeline Bar */}
      <WorkflowTracker
        selectedJob={selectedJob}
        onNavigateToModule={handleNavigate}
      />

      {/* Module Dynamic Render Area */}
      <div className="min-h-full">
        {activeModule === 'Dashboard' && (
          <DashboardModule
            jobs={jobs}
            onNavigate={handleNavigate}
            onSelectJob={setSelectedJob}
            onSaveJob={handleSaveJob}
            onSaveNotification={showNotification}
            isEditing={isEditing}
          />
        )}

        {activeModule === 'Customers' && (
          <CustomersModule
            customers={customers}
            isEditing={isEditing}
            onSaveNotification={showNotification}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomer={handleUpdateCustomer}
          />
        )}

        {activeModule === 'Quotations' && (
          <QuotationsModule
            job={selectedJob}
            allJobs={jobs}
            onSaveJob={handleSaveJob}
            onSelectJob={setSelectedJob}
            isEditing={isEditing}
            onSaveNotification={showNotification}
            onNavigate={handleNavigate}
          />
        )}

        {activeModule === 'ClientQuote' && (
          <ClientQuoteModule
            job={selectedJob}
            onSaveNotification={showNotification}
            onNavigate={handleNavigate}
          />
        )}

        {activeModule === 'Approval' && (
          <ApprovalModule
            job={selectedJob}
            onSaveNotification={showNotification}
            onNavigate={handleNavigate}
          />
        )}

        {activeModule === 'ArtworkUpload' && (
          <ArtworkUploadModule
            job={selectedJob}
            isEditing={isEditing}
            onSaveNotification={showNotification}
            onNavigate={handleNavigate}
            onSaveJob={handleSaveJob}
          />
        )}

        {activeModule === 'Design' && (
          <DesignModule
            job={selectedJob}
            currentRole={currentRole}
            isEditing={isEditing}
            onSaveNotification={showNotification}
            onNavigate={handleNavigate}
          />
        )}

        {activeModule === 'PdfProofApproval' && (
          <PdfProofApprovalModule
            job={selectedJob}
            currentRole={currentRole}
            onSaveNotification={showNotification}
            onNavigate={handleNavigate}
          />
        )}

        {activeModule === 'Production' && (
          <ProductionModule
            job={selectedJob}
            isEditing={isEditing}
            onSaveNotification={showNotification}
            onNavigate={handleNavigate}
          />
        )}

        {activeModule === 'QualityControl' && (
          <QualityControlModule
            job={selectedJob}
            isEditing={isEditing}
            onSaveNotification={showNotification}
            onNavigate={handleNavigate}
          />
        )}

        {activeModule === 'Accounts' && (
          <AccountsModule
            job={selectedJob}
            isEditing={isEditing}
            onSaveNotification={showNotification}
            onNavigate={handleNavigate}
          />
        )}

        {activeModule === 'PaymentTracking' && (
          <PaymentTrackingModule
            job={selectedJob}
            isEditing={isEditing}
            onSaveNotification={showNotification}
            onNavigate={handleNavigate}
          />
        )}

        {activeModule === 'Dispatch' && (
          <DispatchModule
            job={selectedJob}
            isEditing={isEditing}
            onSaveNotification={showNotification}
            onNavigate={handleNavigate}
          />
        )}

        {activeModule === 'Reports' && (
          <ReportsModule
            jobs={jobs}
            onSaveNotification={showNotification}
          />
        )}

        {activeModule === 'AssetLibrary' && (
          <AssetLibraryModule
            assets={INITIAL_ASSETS}
            onSaveNotification={showNotification}
          />
        )}

        {activeModule === 'UserManagement' && (
          <UserManagementModule
            currentRole={currentRole}
            onSaveNotification={showNotification}
          />
        )}

        {activeModule === 'Settings' && (
          <SettingsModule
            onSaveNotification={showNotification}
          />
        )}
      </div>
    </DesktopFrame>
  );
}
