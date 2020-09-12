import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'reports',
    pathMatch: 'full'
  },
  {
    path: 'reports',
    loadChildren: () => import('../pages/reports/reports.module').then( m => m.ProjectsPageModule)
  },
  {
    path: 'new-report',
    loadChildren: () => import('../pages/new-report/new-report.module').then( m => m.NewProjectPageModule)
  },
  {
    path: 'report/:report_id/comment',
    loadChildren: () => import('../pages/comment/comment.module').then( m => m.CommentPageModule)
  },
  {
    path: 'report/:report_id/comment/:comment_id',
    loadChildren: () => import('../pages/comment/comment.module').then( m => m.CommentPageModule)
  },
  {
    path: 'report/:report_id/snag-list',
    loadChildren: () => import('../pages/snag-list/snag-list.module').then( m => m.SnagListPageModule)
  },
  {
    path: 'report/:report_id/report-preview',
    loadChildren: () => import('../pages/report-preview/report-preview.module').then( m => m.ReportPreviewPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
