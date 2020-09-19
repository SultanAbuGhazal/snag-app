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
    path: 'report',
    loadChildren: () => import('../pages/report/report.module').then( m => m.NewProjectPageModule)
  },
  {
    path: 'comment',
    loadChildren: () => import('../pages/comment/comment.module').then( m => m.CommentPageModule)
  },
  {
    path: 'snag-list',
    loadChildren: () => import('../pages/snag-list/snag-list.module').then( m => m.SnagListPageModule)
  },
  {
    path: 'report-preview',
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
